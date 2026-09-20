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

    const { modelUrl } = await request.json();

    if (!modelUrl) {
      return NextResponse.json({ error: '모델 URL이 없습니다.' }, { status: 400 });
    }

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    const previousStep = order.current_step;
    const nextStep = 'CONFIRM_WAITING'; // 모델 업로드 완료 → 고객 확인 대기로 자동 전환
    const now = new Date().toISOString();

    // 🔥 모델 URL 갱신 + 공정 전환을 함께 처리
    const { error } = await supabase
      .from('orders')
      .update({
        model_3d_url: modelUrl,
        current_step: nextStep,
        step_updated_at: now,
      })
      .eq('id', params.orderId);

    if (error) {
      console.error('모델 업로드 반영 오류:', error);
      return NextResponse.json({ error: '업데이트 중 오류가 발생했습니다.' }, { status: 500 });
    }

    // 이력 기록 (step/route.ts와 동일한 패턴): 이전 단계 닫고 새 단계 시작
    // 감사로그 실패가 본 작업 성공을 막지 않도록 에러는 로그만 남긴다.
    const { error: closeError } = await supabase
      .from('order_step_histories')
      .update({ completed_at: now })
      .eq('order_id', params.orderId)
      .is('completed_at', null);

    if (closeError) {
      console.error('이전 단계 이력 종료 실패:', closeError);
    }

    const { error: historyError } = await supabase
      .from('order_step_histories')
      .insert({
        order_id: params.orderId,
        step: nextStep,
        previous_step: previousStep,
        changed_by: user.id,
        started_at: now,
        description: '3D 모델 업로드 완료',
      });

    if (historyError) {
      console.error('공정 이력 기록 실패:', historyError);
    }

    return NextResponse.json({
      success: true,
      message: '모델이 업로드되고 고객 확인 대기 상태로 전환되었습니다.',
      newStep: nextStep,
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}