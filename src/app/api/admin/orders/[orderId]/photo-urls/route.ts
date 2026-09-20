import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// 서명 URL 유효시간 (초) - 1시간
const SIGNED_URL_EXPIRES_IN = 60 * 60;

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // 관리자 권한 확인 (step/route.ts와 동일한 패턴)
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { data: order } = await supabase
      .from('orders')
      .select('photo_urls')
      .eq('id', params.orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    const paths: string[] = order.photo_urls || [];

    if (paths.length === 0) {
      return NextResponse.json({ urls: [] });
    }

    // order-photos는 private 버킷이라, 내부 경로를 그대로 <img src>에 쓸 수 없다.
    // 관리자 세션 기준으로 짧게 유효한 서명 URL을 발급해서 내려준다.
    const { data: signedUrls, error } = await supabase.storage
      .from('order-photos')
      .createSignedUrls(paths, SIGNED_URL_EXPIRES_IN);

    if (error) {
      console.error('서명 URL 발급 오류:', error);
      return NextResponse.json({ error: '사진 URL 발급 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const urls = (signedUrls || [])
      .filter((item) => !item.error && item.signedUrl)
      .map((item) => item.signedUrl);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('서버 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}