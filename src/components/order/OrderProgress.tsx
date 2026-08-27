'use client';

import { STEPS } from '@/lib/utils/constants';

interface OrderProgressProps {
  currentStep: string;
  updatedAt: string;
}

export default function OrderProgress({ currentStep, updatedAt }: OrderProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.code === currentStep);
  const progress = currentIndex >= 0 ? (currentIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <div className="bg-paper rounded-2xl p-6 border border-clay/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display text-sm font-medium text-charcoal">제작 진행 상황</h3>
        <span className="text-xs text-slate">{Math.round(progress)}% 완료</span>
      </div>

      {/* 진행 바 */}
      <div className="relative w-full h-2 bg-clay/30 rounded-full overflow-hidden mb-6">
        <div
          className="absolute h-full bg-accentWarm/70 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 단계 아이콘 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2">
        {STEPS.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.code}
              className={`flex flex-col items-center text-center transition-all ${
                isActive ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`text-xl sm:text-2xl transition-all ${
                  isCurrent ? 'scale-125 animate-pulse' : ''
                }`}
              >
                {step.emoji}
              </div>
              <span
                className={`text-[8px] sm:text-[10px] mt-1 leading-tight ${
                  isActive ? 'text-charcoal font-medium' : 'text-slate'
                }`}
              >
                {step.label}
              </span>
              {isCurrent && (
                <span className="text-[8px] text-accentWarm mt-0.5 font-medium">● 진행중</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate mt-4 text-right">
        마지막 업데이트: {new Date(updatedAt).toLocaleString('ko-KR')}
      </p>
    </div>
  );
}
