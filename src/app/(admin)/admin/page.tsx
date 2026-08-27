import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 전체 주문 데이터 가져오기 (관리자는 전체 조회 가능)
  const { data: orders } = await supabase
    .from('orders')
    .select('id, amount, status, created_at, revision_note')
    .order('created_at', { ascending: false });

  // 오늘 날짜 계산 (자정 기준)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 1. 오늘의 신규 주문 수
  const todayOrders = orders?.filter((order) => {
    const orderDate = new Date(order.created_at);
    return orderDate >= today && orderDate < tomorrow;
  }).length || 0;

  // 2. 진행 중인 주문 수 (배송 완료가 아닌 주문)
  const processingOrders = orders?.filter((order) => order.status !== 'DELIVERED').length || 0;

  // 3. 누적 매출 (amount 합계)
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

  // 4. 긴급 주문 (D-day 3일 이하)
  const urgentOrders = orders?.filter((order) => {
    const orderDate = new Date(order.created_at);
    let requestedDate = new Date(orderDate);
    
    // 노트에 날짜가 있으면 파싱, 없으면 +10일
    const dateRegex = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
    const match = order.revision_note?.match(dateRegex);
    
    if (match) {
      requestedDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    } else {
      requestedDate.setDate(orderDate.getDate() + 10);
    }

    // 시간 제거 후 비교
    requestedDate.setHours(0, 0, 0, 0);
    const diffTime = requestedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays <= 3;
  }).length || 0;

  // 5. 최근 주문 5개 (이미 내림차순 정렬됨)
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-medium text-charcoal">📊 관리자 대시보드</h2>
        <div className="text-sm text-slate">
          {today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>

      {/* 요약 위젯 (4개 카드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-clay/20">
          <p className="text-sm text-slate mb-2">오늘의 신규 주문</p>
          <p className="text-3xl font-bold text-charcoal">{todayOrders}건</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-clay/20">
          <p className="text-sm text-slate mb-2">진행 중인 주문</p>
          <p className="text-3xl font-bold text-blue-600">{processingOrders}건</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-clay/20">
          <p className="text-sm text-slate mb-2">누적 매출</p>
          <p className="text-3xl font-bold text-charcoal">{totalRevenue.toLocaleString()}원</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-red-200 bg-red-50">
          <p className="text-sm text-red-500 mb-2">⚠️ 긴급 주문 (D-3)</p>
          <p className="text-3xl font-bold text-red-600">{urgentOrders}건</p>
        </div>
      </div>

      {/* 최근 주문 목록 */}
      <div className="bg-white rounded-2xl border border-clay/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-clay/20 flex justify-between items-center">
          <h3 className="font-display text-lg font-medium text-charcoal">최근 주문 내역</h3>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            전체 보기 →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b border-clay/20">
              <th className="text-left px-6 py-3 font-medium text-slate">주문번호</th>
              <th className="text-left px-6 py-3 font-medium text-slate">금액</th>
              <th className="text-left px-6 py-3 font-medium text-slate">상태</th>
              <th className="text-left px-6 py-3 font-medium text-slate">주문일</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const statusLabels: Record<string, string> = {
                'PENDING_UPLOAD': '주문 접수',
                'MODELING': '3D 모델링',
                'REVIEW': '시안 확인',
                'REVISION': '수정 요청',
                'PRINTING': '출력 준비',
                'POST_PROCESSING': '레진 출력',
                'SHIPPING': '배송중',
                'DELIVERED': '배송 완료',
              };
              
              return (
                <tr key={order.id} className="border-b border-clay/10 hover:bg-cream/30 transition">
                  <td className="px-6 py-4 font-mono text-xs text-charcoal">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-charcoal">{order.amount?.toLocaleString()}원</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-paper rounded-full text-xs">
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate text-xs">
                    {new Date(order.created_at).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              );
            })}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate">
                  아직 주문이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}