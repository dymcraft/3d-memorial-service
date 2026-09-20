import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId'); // 우리 쪽 order_number
  const amount = searchParams.get('amount');

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.redirect(`${origin}/checkout?fail=1`);
  }

  const secretKey = process.env.TOSS_SECRET_KEY!;
  const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

  try {
    // 토스 서버에 결제 승인 요청 (서버-서버 통신)
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const tossData = await tossRes.json();

    if (!tossRes.ok) {
      console.error('토스 결제 승인 실패:', tossData);
      return NextResponse.redirect(
        `${origin}/checkout?fail=1&reason=${encodeURIComponent(tossData.message || '')}`
      );
    }

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        payment_status: 'DONE',
        payment_key: paymentKey,
      })
      .eq('order_number', orderId)
      .select()
      .single();

    if (error || !order) {
      console.error('주문 결제 상태 갱신 실패:', error);
      return NextResponse.redirect(`${origin}/checkout?fail=1`);
    }

    return NextResponse.redirect(`${origin}/order/complete?orderId=${order.id}`);
  } catch (err) {
    console.error('결제 승인 처리 오류:', err);
    return NextResponse.redirect(`${origin}/checkout?fail=1`);
  }
}