import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface CreateOrderBody {
  productId: string;
  optionIds?: string[];
}

// 주문번호 생성: ORD-YYYYMMDD-XXXX (XXXX는 4자리 랜덤)
function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body: CreateOrderBody = await request.json();
    const { productId, optionIds = [] } = body;

    if (!productId) {
      return NextResponse.json({ error: '상품을 선택해주세요.' }, { status: 400 });
    }

    // 🔥 금액은 절대 클라이언트 값을 믿지 않고 서버에서 다시 계산한다.
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (!product) {
      return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 });
    }

    let selectedOptions: Record<string, string> = {};
    let optionsTotal = 0;

    if (optionIds.length > 0) {
      const { data: options } = await supabase
        .from('product_options')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .in('id', optionIds);

      if (!options || options.length !== optionIds.length) {
        return NextResponse.json(
          { error: '선택한 옵션 중 유효하지 않은 항목이 있습니다.' },
          { status: 400 }
        );
      }

      for (const opt of options) {
        selectedOptions[opt.option_type] = opt.option_name;
        optionsTotal += opt.price_delta || 0;
      }
    }

    const baseAmount = product.base_price;
    const amount = baseAmount + optionsTotal;

    // order_number 중복 시 재시도 (유니크 제약이 있을 수 있어 방어적으로 처리)
    let insertedOrder = null;
    let lastError = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const orderNumber = generateOrderNumber();

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          product_id: productId,
          order_number: orderNumber,
          selected_options: selectedOptions,
          base_amount: baseAmount,
          amount: amount,
          // status는 로직에서 더 이상 사용하지 않지만(current_step으로 통일),
          // 컬럼에 NOT NULL 제약이 있을 수 있어 방어적으로 초기값을 채워둔다.
          status: 'PENDING_UPLOAD',
          payment_status: 'PENDING',
          current_step: 'ORDER_RECEIVED',
          step_updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error) {
        insertedOrder = data;
        break;
      }

      // 유니크 제약 위반(주문번호 중복)이면 재시도, 그 외 에러는 즉시 중단
      if (error.code !== '23505') {
        lastError = error;
        break;
      }
      lastError = error;
    }

    if (!insertedOrder) {
      console.error('주문 생성 오류:', lastError);
      return NextResponse.json({ error: '주문 생성 중 오류가 발생했습니다.' }, { status: 500 });
    }

    // 🔥 이력 기록: 최초 단계(ORDER_RECEIVED) 시작 행을 남긴다.
    // 감사로그 실패가 주문 생성 성공을 막으면 안 되므로 에러는 로그만 남긴다.
    const { error: historyError } = await supabase
      .from('order_step_histories')
      .insert({
        order_id: insertedOrder.id,
        step: 'ORDER_RECEIVED',
        previous_step: null,
        changed_by: user.id,
        started_at: insertedOrder.step_updated_at,
      });

    if (historyError) {
      console.error('공정 이력 기록 실패:', historyError);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: insertedOrder.id,
        orderNumber: insertedOrder.order_number,
        amount: insertedOrder.amount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}