import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 관리자 권한 확인
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { step } = await request.json();

    if (!step) {
      return NextResponse.json({ error: '변경할 단계를 선택해주세요.' }, { status: 400 });
    }

    // 주문 존재 확인
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 공정 업데이트
    const { error } = await supabase
      .from('orders')
      .update({
        current_step: step,
        step_updated_at: new Date().toISOString(),
        status: step,
      })
      .eq('id', params.orderId);

    if (error) {
      console.error('공정 업데이트 오류:', error);
      return NextResponse.json({ error: '업데이트 중 오류가 발생했습니다.' }, { status: 500 });
    }

    // TODO: 알림 트리거 (SMS/이메일)

    return NextResponse.json({
      success: true,
      message: '공정이 변경되었습니다.',
      newStep: step,
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}