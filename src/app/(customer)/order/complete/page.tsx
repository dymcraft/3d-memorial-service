import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const { orderId } = searchParams;

  if (!orderId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-ink-soft">잘못된 접근입니다.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from('orders')
    .select('*, products(name)')
    .eq('id', orderId)
    .single();

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-ink-soft">주문을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="font-display text-2xl font-bold text-ink mb-3">결제가 완료되었습니다</h1>
      <p className="text-sm text-ink-soft mb-8">
        주문번호 <span className="font-medium text-ink">{order.order_number}</span> · {order.products?.name}
      </p>
      <div className="border border-line p-6 mb-8 text-left">
        <p className="text-sm text-ink-soft">
          이제 정면·측면 사진을 올려주시면 제작이 시작됩니다.
        </p>
      </div>
      <Link
        href={`/order/${order.id}/upload`}
        className="inline-block bg-ink text-stone-paper px-8 py-3 text-sm hover:bg-bronze-deep transition-colors"
      >
        사진 업로드하러 가기 →
      </Link>
    </div>
  );
}
