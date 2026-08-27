import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { action, revisionNote } = await request.json();

    // 주문 소유권 확인
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    if (order.current_step !== 'CONFIRM_WAITING') {
      return NextResponse.json({ error: '확인 대기 상태가 아닙니다.' }, { status: 400 });
    }

    let newStep: string;
    let status: string;

    if (action === 'approve') {
      newStep = 'APPROVED';
      status = '승인 완료';
    } else if (action === 'revision') {
      if (!revisionNote || revisionNote.trim().length < 3) {
        return NextResponse.json(
          { error: '수정 요청 내용을 3자 이상 입력해주세요.' },
          { status: 400 }
        );
      }
      newStep = 'REVISION_REQUESTED';
      status = '수정 요청';
    } else {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 상태 업데이트
    const { error } = await supabase
      .from('orders')
      .update({
        current_step: newStep,
        step_updated_at: new Date().toISOString(),
        revision_note: action === 'revision' ? revisionNote : null,
      })
      .eq('id', params.orderId);

    if (error) {
      console.error('업데이트 오류:', error);
      return NextResponse.json({ error: '처리 중 오류가 발생했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${status}되었습니다.`,
      newStep,
    });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}