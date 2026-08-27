'use client';

interface ModelErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ModelError({ 
  message = '3D 모델을 불러오지 못했습니다.', 
  onRetry 
}: ModelErrorProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cream/50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto text-4xl">⚠️</div>
        <p className="text-sm text-slate">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-charcoal text-white text-sm rounded-full hover:bg-charcoal/80 transition"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}