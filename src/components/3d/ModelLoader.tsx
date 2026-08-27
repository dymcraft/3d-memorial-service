'use client';

export default function ModelLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cream">
      <div className="relative">
        {/* 회전하는 3D 큐브 애니메이션 */}
        <div className="w-16 h-16">
          <div className="w-full h-full animate-spin">
            <div className="w-4 h-4 bg-accentWarm absolute top-0 left-1/2 -translate-x-1/2 rounded" />
            <div className="w-4 h-4 bg-accentWarm/60 absolute bottom-0 left-1/2 -translate-x-1/2 rounded" />
            <div className="w-4 h-4 bg-accentWarm/40 absolute left-0 top-1/2 -translate-y-1/2 rounded" />
            <div className="w-4 h-4 bg-accentWarm/40 absolute right-0 top-1/2 -translate-y-1/2 rounded" />
          </div>
        </div>
        <p className="text-sm text-mist mt-4 animate-pulse">3D 모델을 불러오는 중...</p>
      </div>
    </div>
  );
}