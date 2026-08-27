'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 🔥 이게 핵심입니다! ModelViewer를 동적 임포트로 감싸서 SSR을 완전히 차단합니다.
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

interface ConfirmClientProps {
  order: any;
  orderId: string;
}

export default function ConfirmClient({ order, orderId }: ConfirmClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async (action: 'approve' | 'revision') => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          revisionNote: action === 'revision' ? revisionNote : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/order/${orderId}`);
        router.refresh();
      } else {
        setError(data.error || '처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* 상단 네비게이션 */}
      <div className="flex items-center gap-4">
        <Link
          href={`/order/${orderId}`}
          className="text-slate hover:text-charcoal transition-colors text-sm flex items-center gap-1"
        >
          ← 돌아가기
        </Link>
        <h1 className="font-display text-2xl font-medium text-charcoal">3D 시안 확인</h1>
      </div>

      {/* 주문 정보 */}
      <div className="bg-cream rounded-2xl p-6 border border-clay/20">
        <p className="text-sm text-slate mb-2">
          주문번호: <span className="font-medium text-charcoal">{order.order_number}</span>
        </p>
        <p className="text-sm text-slate">
          상품: <span className="font-medium text-charcoal">{order.products?.name}</span>
        </p>
        <p className="text-sm text-slate mt-1">
          상태: <span className="font-medium text-accentWarm">시안 확인 대기 중</span>
        </p>
      </div>

      {/* 🔥 여기서 ModelViewer를 사용합니다. 이제 SSR이 차단되어 P 에러가 발생하지 않습니다. */}
      <div className="h-[500px] bg-cream rounded-2xl overflow-hidden border border-clay/20 relative">
        <ModelViewer modelUrl={order.model_3d_url} autoRotate={false} />
      </div>

      {/* 확인/수정 폼 */}
      <div className="bg-paper rounded-2xl p-6 border border-clay/20">
        <p className="text-sm text-slate mb-4">
          👆 마우스로 3D 모델을 돌려보며 확인해주세요.
        </p>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl mb-4">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleConfirm('approve')}
            disabled={loading}
            className="w-full py-4 bg-charcoal text-white rounded-2xl font-medium hover:bg-charcoal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '처리 중...' : '✅ 시안 승인하기'}
          </button>

          <div className="border-t border-clay/20 pt-4 space-y-3">
            <p className="text-sm text-slate">수정이 필요하신가요?</p>
            <textarea
              placeholder="수정을 원하는 부분을 자세히 적어주세요 (예: 얼굴 각도, 크기, 비율, 표정 등)"
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              rows={4}
              className="w-full p-3 border border-clay/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accentWarm/50 bg-white transition-all resize-none"
              disabled={loading}
            />
            <button
              onClick={() => handleConfirm('revision')}
              disabled={loading || !revisionNote.trim()}
              className="w-full py-4 bg-accentWarm/10 text-accentWarm border-2 border-accentWarm/30 rounded-2xl font-medium hover:bg-accentWarm/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '🔄 수정 요청하기'}
            </button>
            {!revisionNote.trim() && (
              <p className="text-xs text-mist text-center">
                수정 요청을 위해 내용을 입력해주세요.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-slate">
          💡 시안 승인 후에는 제작이 시작되어 수정이 어려울 수 있습니다.
          신중하게 확인해주세요.
        </p>
      </div>
    </div>
  );
}