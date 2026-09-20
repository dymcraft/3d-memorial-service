import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ModelUploadForm from '@/components/admin/ModelUploadForm';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-cream">
      <p className="text-sm text-mist">3D 뷰어를 불러오는 중...</p>
    </div>
  ),
});

export default async function AdminModelUploadPage({
  params,
}: {
  params: { orderId: string };
}) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, products(name)')
    .eq('id', params.orderId)
    .single();

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate">주문을 찾을 수 없습니다.</p>
        <Link href="/admin/orders" className="text-accentWarm text-sm mt-4 inline-block">
          ← 주문 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/orders/${params.orderId}`}
          className="text-slate hover:text-charcoal transition text-sm"
        >
          ← 주문 상세로
        </Link>
        <h1 className="font-display text-xl font-medium text-charcoal">
          3D 모델 업로드 — {order.order_number}
        </h1>
      </div>

      <div className="bg-paper rounded-2xl p-4 border border-clay/20 text-sm text-slate">
        상품: {order.products?.name || '-'} · 현재 공정: {order.current_step}
      </div>

      {order.model_3d_url && (
        <div>
          <h2 className="text-sm font-medium text-charcoal mb-2">현재 업로드된 모델</h2>
          <div className="h-[400px] rounded-2xl overflow-hidden border border-clay/20">
            <ModelViewer modelUrl={order.model_3d_url} autoRotate={true} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-clay/20">
        <h2 className="text-sm font-medium text-charcoal mb-4">
          {order.model_3d_url ? '새 모델로 교체' : '새 모델 업로드'}
        </h2>
        <ModelUploadForm orderId={params.orderId} />
      </div>
    </div>
  );
}
