import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import OrderProgress from '@/components/order/OrderProgress';

// 🔥 ModelViewer를 동적 임포트로 감쌉니다 (SSR 완전 차단)
const ModelViewer = dynamic(
  () => import('@/components/3d/ModelViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-cream">
        <div className="text-center text-mist">
          <div className="text-4xl mb-2">⏳</div>
          <p className="text-sm">3D 뷰어를 불러오는 중...</p>
        </div>
      </div>
    ),
  }
);

export default async function OrderDetailPage({ 
  params 
}: { 
  params: { orderId: string } 
}) {
  const supabase = await createClient();
  
  // 사용자 정보 조회 (관리자 여부 확인용)
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = profile?.role === 'admin';
  }

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      products (name, base_price)
    `)
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

  const hasModel = order.model_3d_url && order.model_3d_url.length > 0;
  const isWaitingForConfirm = order.current_step === 'CONFIRM_WAITING';

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-charcoal">
            주문 상세
          </h1>
          <p className="text-sm text-slate">
            주문번호: {order.order_number}
          </p>
        </div>
        <div className="px-4 py-2 bg-accentWarm/10 text-accentWarm rounded-full text-sm font-medium">
          {order.current_step === 'DELIVERED' ? '✅ 배송 완료' : 
           order.current_step === 'SHIPPED' ? '🚚 배송중' :
           order.current_step === 'PRINTING_RESIN' ? '🧪 출력중' :
           '진행 중'}
        </div>
      </div>

      {/* 🔥 관리자 전용 UI */}
      {isAdmin && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <p className="text-sm font-medium text-yellow-800">관리자 전용</p>
              <p className="text-xs text-yellow-700">공정 변경, 모델 업로드 등 관리자 기능을 사용할 수 있습니다.</p>
            </div>
          </div>
          <Link
            href={`/admin/orders/${order.id}`}
            className="px-4 py-2 bg-yellow-800 text-white text-sm rounded-lg hover:bg-yellow-900 transition"
          >
            관리자 페이지로 이동 →
          </Link>
        </div>
      )}

      {/* 공정 진행상황 */}
      <OrderProgress 
        currentStep={order.current_step} 
        updatedAt={order.step_updated_at} 
      />

      {/* 3D 뷰어 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-medium text-charcoal">
            {hasModel ? '3D 시안' : '3D 모델 준비 중'}
          </h2>
          {isWaitingForConfirm && hasModel && (
            <Link
              href={`/order/${params.orderId}/confirm`}
              className="px-6 py-2 bg-accentWarm text-white text-sm font-medium rounded-full hover:bg-accentWarmHover transition shadow-soft"
            >
              시안 확인하기 →
            </Link>
          )}
        </div>
        
        {/* 🔥 이제 ModelViewer가 dynamic으로 감싸져서 SSR 오류가 발생하지 않습니다 */}
        <div className="h-[500px] bg-cream rounded-2xl overflow-hidden border border-clay/20">
          <ModelViewer 
            modelUrl={hasModel ? order.model_3d_url : null}
            autoRotate={!isWaitingForConfirm}
          />
        </div>
        
        {isWaitingForConfirm && hasModel && (
          <p className="text-sm text-accentWarm mt-3 text-center">
            ⏳ 3D 시안을 확인하고 승인 또는 수정 요청을 해주세요.
          </p>
        )}
      </div>

      {/* 주문 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-paper rounded-2xl p-6 border border-clay/20">
          <h3 className="text-sm font-medium text-charcoal mb-3">상품 정보</h3>
          <p className="text-sm text-slate">{order.products?.name}</p>
          <p className="text-sm font-medium text-charcoal mt-2">
            {order.amount?.toLocaleString()}원
          </p>
        </div>
        <div className="bg-paper rounded-2xl p-6 border border-clay/20">
          <h3 className="text-sm font-medium text-charcoal mb-3">제작 정보</h3>
          <p className="text-sm text-slate">
            상태: {order.status || '접수 완료'}
          </p>
          <p className="text-sm text-slate mt-1">
            주문일: {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 뒤로 가기 */}
      <div className="pt-4">
        <Link 
          href="/dashboard" 
          className="text-sm text-slate hover:text-charcoal transition inline-flex items-center gap-2"
        >
          ← 내 주문 목록으로
        </Link>
      </div>
    </div>
  );
}