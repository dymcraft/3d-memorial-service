import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { STEPS } from '@/lib/utils/constants';
import ModelViewer from '@/components/3d/ModelViewer';
import OrderProgress from '@/components/order/OrderProgress';
import StepUpdater from '@/components/admin/StepUpdater';

export default async function AdminOrderDetailPage({ 
  params 
}: { 
  params: { orderId: string } 
}) {
  const supabase = await createClient();

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // 주문 정보 조회
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      users (email, name, phone),
      products (name, base_price)
    `)
    .eq('id', params.orderId)
    .single();

  if (!order) {
    redirect('/admin/orders');
  }

  const hasModel = order.model_3d_url && order.model_3d_url.length > 0;

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-slate hover:text-charcoal text-sm">
          ← 주문 목록으로
        </Link>
        <h2 className="font-display text-2xl font-medium text-charcoal">
          📦 주문 상세
        </h2>
        <span className="text-sm text-slate ml-auto">
          주문번호: {order.order_number}
        </span>
      </div>

      {/* 1. 공정 변경 섹션 */}
      <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
        <h3 className="font-display text-lg font-medium text-charcoal mb-4">🔄 공정 관리</h3>
        <StepUpdater orderId={order.id} currentStep={order.current_step} />
      </div>

      {/* 2. 주문 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <h3 className="font-display text-sm font-medium text-charcoal mb-3">👤 고객 정보</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate">이름:</span> {order.users?.name || '-'}</p>
            <p><span className="text-slate">이메일:</span> {order.users?.email}</p>
            <p><span className="text-slate">전화번호:</span> {order.users?.phone || '-'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <h3 className="font-display text-sm font-medium text-charcoal mb-3">📦 상품 정보</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate">상품명:</span> {order.products?.name}</p>
            <p><span className="text-slate">금액:</span> <span className="font-medium">{order.amount?.toLocaleString()}원</span></p>
            <p><span className="text-slate">주문일:</span> {new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>
      </div>

      {/* 3. 3D 뷰어 */}
      <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-medium text-charcoal">🎨 3D 시안</h3>
          <div className="flex gap-2">
            {hasModel && (
              <a
                href={order.model_3d_url}
                target="_blank"
                className="text-xs text-accentWarm hover:text-accentWarmHover transition"
              >
                모델 파일 다운로드
              </a>
            )}
            <Link
              href={`/admin/orders/${order.id}/upload`}
              className="text-xs bg-charcoal text-white px-3 py-1 rounded-lg hover:bg-charcoal/90 transition"
            >
              모델 업로드
            </Link>
          </div>
        </div>
        <div className="h-[400px] bg-cream rounded-xl overflow-hidden border border-clay/20">
          <ModelViewer modelUrl={hasModel ? order.model_3d_url : null} autoRotate={true} />
        </div>
      </div>

      {/* 4. 진행 상황 */}
      <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
        <h3 className="font-display text-lg font-medium text-charcoal mb-4">📊 진행 상황</h3>
        <OrderProgress currentStep={order.current_step} updatedAt={order.step_updated_at} />
      </div>

      {/* 5. 고객 요청사항 + 관리자 메모 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <h3 className="font-display text-sm font-medium text-charcoal mb-3">📝 고객 요청사항</h3>
          <p className="text-sm text-slate bg-cream p-4 rounded-xl whitespace-pre-wrap">
            {order.revision_note || '요청사항이 없습니다.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <h3 className="font-display text-sm font-medium text-charcoal mb-3">🗒️ 관리자 메모</h3>
          <p className="text-sm text-slate bg-cream p-4 rounded-xl whitespace-pre-wrap">
            {order.admin_memo || '작성된 메모가 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}