'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { STEPS } from '@/lib/utils/constants';

// 🔥 status 필드 대신 current_step(STEPS)을 기준으로 색상을 매핑한다.
// STEPS 자체엔 색상 정보가 없어서 여기서만 로컬로 정의 (constants.ts는 안 건드림).
const STEP_STYLE: Record<string, { color: string; bg: string }> = {
  ORDER_RECEIVED: { color: 'text-slate-600', bg: 'bg-slate-100' },
  AI_PROCESSING: { color: 'text-blue-600', bg: 'bg-blue-100' },
  CONFIRM_WAITING: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
  APPROVED: { color: 'text-teal-600', bg: 'bg-teal-100' },
  REVISION_REQUESTED: { color: 'text-red-600', bg: 'bg-red-100' },
  PRINTING_START: { color: 'text-purple-600', bg: 'bg-purple-100' },
  PRINTING_RESIN: { color: 'text-purple-600', bg: 'bg-purple-100' },
  PRINTING_PLA: { color: 'text-purple-600', bg: 'bg-purple-100' },
  POST_PROCESS: { color: 'text-indigo-600', bg: 'bg-indigo-100' },
  PACKAGING: { color: 'text-indigo-600', bg: 'bg-indigo-100' },
  SHIPPED: { color: 'text-green-600', bg: 'bg-green-100' },
  DELIVERED: { color: 'text-gray-700', bg: 'bg-gray-200' },
};
const DEFAULT_STYLE = { color: 'text-slate-600', bg: 'bg-slate-100' };

export default function OrderTableClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [adminMemo, setAdminMemo] = useState('');
  // 🔥 order-photos가 private 버킷이라 photo_urls(내부 경로)를 그대로 <img src>에
  // 쓸 수 없다. 모달을 열 때 서명 URL을 발급받아 여기에 담아서 렌더링한다.
  const [photoDisplayUrls, setPhotoDisplayUrls] = useState<string[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosError, setPhotosError] = useState('');
  const supabase = createClient();

  const getCountByStep = (stepCode: string) => {
    return orders.filter((order) => order.current_step === stepCode).length;
  };

  const calculateDates = (createdAt: string, note: string | null) => {
    const orderDate = new Date(createdAt);
    let requestedDate = new Date(orderDate);
    const dateRegex = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
    const match = note?.match(dateRegex);
    
    if (match) {
      requestedDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    } else {
      requestedDate.setDate(orderDate.getDate() + 10);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    requestedDate.setHours(0, 0, 0, 0);
    const diffTime = requestedDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { requestedDate, remainingDays };
  };

  const openModal = async (order: any) => {
    setSelectedOrder(order);
    setAdminMemo(order.admin_memo || '');
    setPhotoDisplayUrls([]);
    setPhotosError('');

    if (order.photo_urls && order.photo_urls.length > 0) {
      setPhotosLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${order.id}/photo-urls`);
        const data = await res.json();
        if (res.ok) {
          setPhotoDisplayUrls(data.urls || []);
        } else {
          setPhotosError(data.error || '사진을 불러오지 못했습니다.');
        }
      } catch {
        setPhotosError('사진을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setPhotosLoading(false);
      }
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setPhotoDisplayUrls([]);
    setPhotosError('');
  };

  const saveMemo = async () => {
    if (!selectedOrder) return;
    const { error } = await supabase
      .from('orders')
      .update({ admin_memo: adminMemo })
      .eq('id', selectedOrder.id);
    if (!error) setSelectedOrder({ ...selectedOrder, admin_memo: adminMemo });
    else alert('메모 저장 실패');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-medium text-charcoal">📦 주문 관리</h2>
        <div className="text-sm text-slate">총 {orders?.length || 0}개 주문</div>
      </div>

      {/* 1번: 상태 현황 바 (current_step 기준) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STEPS.map((step) => {
          const count = getCountByStep(step.code);
          const style = STEP_STYLE[step.code] || DEFAULT_STYLE;
          return (
            <button
              key={step.code}
              className={`px-4 py-1.5 text-sm rounded-full border font-medium transition ${style.bg} ${style.color}`}
            >
              {step.emoji} {step.label}
              {count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs font-bold shadow-sm">
                  {count}건
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 주문 목록 테이블 */}
      <div className="bg-white rounded-2xl border border-clay/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-clay/20">
                <th className="text-left px-4 py-3 font-medium text-slate">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-slate">주문일</th>
                <th className="text-left px-4 py-3 font-medium text-slate">고객</th>
                <th className="text-left px-4 py-3 font-medium text-slate">상품</th>
                <th className="text-left px-4 py-3 font-medium text-slate">금액</th>
                <th className="text-left px-4 py-3 font-medium text-slate">공정</th>
                <th className="text-left px-4 py-3 font-medium text-slate">요청날짜</th>
                <th className="text-left px-4 py-3 font-medium text-slate">잔여일</th>
                <th className="text-left px-4 py-3 font-medium text-slate">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => {
                const { requestedDate, remainingDays } = calculateDates(order.created_at, order.revision_note);
                const currentStep = STEPS.find((s) => s.code === order.current_step);
                const style = STEP_STYLE[order.current_step] || DEFAULT_STYLE;

                return (
                  <tr key={order.id} className="border-b border-clay/10 hover:bg-cream/30 transition">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        href={`/order/${order.id}`}
                        className="text-blue-600 underline font-bold">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate text-xs">{new Date(order.created_at).toLocaleDateString('ko-KR')}</td>
                    <td className="px-4 py-3 text-slate">{order.users?.email || '알 수 없음'}</td>
                    <td className="px-4 py-3 text-slate">{order.products?.name || '-'}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">{order.amount?.toLocaleString()}원</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${style.bg} ${style.color}`}>
                        {currentStep ? `${currentStep.emoji} ${currentStep.label}` : order.current_step}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate text-xs">{requestedDate.toLocaleDateString('ko-KR')}</td>
                    <td className={`px-4 py-3 font-bold text-xs ${remainingDays < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                      {remainingDays < 0 ? `D+${Math.abs(remainingDays)}` : `D-${remainingDays}`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openModal(order)}
                        className="text-xs text-accentWarm hover:text-accentWarmHover transition"
                      >
                        상세 보기 →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2번: 상세 보기 모달 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">×</button>
            
            <h2 className="font-display text-xl font-bold mb-4">주문 상세 정보</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">📋 선택한 옵션</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  {selectedOrder.selected_options && Object.keys(selectedOrder.selected_options).length > 0 ? (
                    Object.entries(selectedOrder.selected_options).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-200 py-2 last:border-0">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))
                  ) : <p className="text-gray-400 text-sm">선택된 옵션이 없습니다.</p>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">📝 고객 요청사항 (Note)</h3>
                <p className="bg-yellow-50 p-4 rounded-lg text-sm whitespace-pre-wrap border border-yellow-100">
                  {selectedOrder.revision_note || '요청사항이 없습니다.'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">🖼️ 업로드한 원본 사진</h3>
                {/* 🔥 order-photos는 private 버킷이라 photo_urls(내부 경로)를 바로 못 쓰고,
                    openModal에서 발급받은 서명 URL(photoDisplayUrls)로 렌더링한다. */}
                {photosLoading ? (
                  <p className="text-gray-400 text-sm">사진 불러오는 중...</p>
                ) : photosError ? (
                  <p className="text-red-500 text-sm">{photosError}</p>
                ) : photoDisplayUrls.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {photoDisplayUrls.map((url, idx) => (
                      <img key={idx} src={url} alt="업로드 사진" className="w-full h-24 object-cover rounded-lg border" />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">업로드된 사진이 없습니다.</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">🗒️ 관리자 메모</h3>
                <textarea
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이 주문에 대한 내부 메모를 남겨주세요."
                />
                <button onClick={saveMemo} className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                  메모 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
