'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STEPS } from '@/lib/utils/constants';

interface StepUpdaterProps {
  orderId: string;
  currentStep: string;
}

export default function StepUpdater({ orderId, currentStep }: StepUpdaterProps) {
  const router = useRouter();
  const [step, setStep] = useState(currentStep);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    if (step === currentStep) {
      setMessage('현재와 동일한 단계입니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/orders/${orderId}/step`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ 공정이 변경되었습니다!');
        router.refresh();
      } else {
        setMessage('❌ ' + (data.error || '변경 실패'));
      }
    } catch (error) {
      setMessage('❌ 네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <select
          value={step}
          onChange={(e) => setStep(e.target.value)}
          className="flex-1 p-2.5 border border-clay/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accentWarm/50 bg-white"
          disabled={loading}
        >
          {STEPS.map((s) => (
            <option key={s.code} value={s.code}>
              {s.emoji} {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          disabled={loading || step === currentStep}
          className="px-6 py-2.5 bg-charcoal text-white text-sm rounded-xl hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '변경 중...' : '변경 적용'}
        </button>
      </div>

      {message && (
        <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <p className="text-xs text-slate">현재 단계: {STEPS.find(s => s.code === currentStep)?.label}</p>
    </div>
  );
}