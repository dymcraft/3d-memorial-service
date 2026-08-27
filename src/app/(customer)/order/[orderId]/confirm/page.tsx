import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ConfirmClient from './ConfirmClient';

export default async function ConfirmPage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-slate">로그인이 필요합니다.</p>
        <Link href="/login" className="text-accentWarm text-sm mt-4 inline-block">
          로그인하러 가기 →
        </Link>
      </div>
    );
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*, products(name)')
    .eq('id', params.orderId)
    .single();

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-slate">주문을 찾을 수 없습니다.</p>
        <Link href="/dashboard" className="text-accentWarm text-sm mt-4 inline-block">
          ← 내 주문 목록으로
        </Link>
      </div>
    );
  }

  if (order.user_id !== user.id) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-slate">이 주문에 대한 권한이 없습니다.</p>
        <Link href="/dashboard" className="text-accentWarm text-sm mt-4 inline-block">
          ← 내 주문 목록으로
        </Link>
      </div>
    );
  }

  if (order.current_step !== 'CONFIRM_WAITING') {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-slate">이미 확인이 완료된 주문입니다.</p>
        <Link href={`/order/${params.orderId}`} className="text-accentWarm text-sm mt-4 inline-block">
          ← 주문 상세로 돌아가기
        </Link>
      </div>
    );
  }

  return <ConfirmClient order={order} orderId={params.orderId} />;
}