'use client';

import { useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    TossPayments: (clientKey: string) => any;
  }
}

interface TossPaymentProps {
  productId: string;
  optionIds: string[];
  amount: number;
  orderName: string;
  customerName?: string;
}

export default function TossPayment({
  productId,
  optionIds,
  amount,
  orderName,
  customerName,
}: TossPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sdkReady, setSdkReady] = useState(false);

  const handlePay = async () => {
    if (!sdkReady || !window.TossPayments) {
      setError('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1) 먼저 "결제 대기" 주문을 생성한다. 금액은 서버(/api/orders)가 다시 계산한다.
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, optionIds }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setError(orderData.error || '주문 생성에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 2) 토스 결제창 호출. 토스의 orderId 파라미터엔 우리 order_number를 그대로 쓴다.
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const tossPayments = window.TossPayments(clientKey);
      const origin = window.location.origin;

      await tossPayments.requestPayment('카드', {
        amount: orderData.amount,
        orderId: orderData.orderNumber,
        orderName,
        customerName,
        successUrl: `${origin}/api/payment/toss/confirm`,
        failUrl: `${origin}/checkout?productId=${productId}&options=${optionIds.join(',')}&fail=1`,
      });
      // 성공 시 브라우저가 successUrl로 리다이렉트되므로 이 아래는 실행되지 않는다.
    } catch (err: any) {
      // 결제창을 닫거나 취소한 경우도 여기로 들어온다.
      setError(err?.message || '결제가 취소되었거나 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onLoad={() => setSdkReady(true)}
        strategy="afterInteractive"
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <button
        onClick={handlePay}
        disabled={loading || !sdkReady}
        className="w-full bg-ink text-stone-paper py-3 text-sm hover:bg-bronze-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '처리 중...' : !sdkReady ? '결제 모듈 로딩 중...' : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </>
  );
}
