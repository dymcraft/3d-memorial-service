'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Center, Environment, Html } from '@react-three/drei';
import ModelLoader from './ModelLoader';
import ModelError from './ModelError';
import ModelErrorBoundary from './ModelErrorBoundary';

interface ModelViewerProps {
  modelUrl: string | null;
  autoRotate?: boolean;
  className?: string;
}

// 3D 메쉬 컴포넌트
// 🔥 try/catch 제거: useGLTF는 Suspense 훅이라 로딩 중일 때 Promise를 throw합니다.
// try/catch가 있으면 그 정상적인 throw까지 "에러"로 오인해서 가로채버려
// 렌더링이 조용히 멈추는 버그가 있었습니다. 진짜 로딩 실패는
// 이제 ModelErrorBoundary가 정상적으로 잡습니다.
function MeshModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({
  modelUrl,
  autoRotate = true,
  className = '',
}: ModelViewerProps) {
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  if (!modelUrl) {
    return (
      <div className={`w-full h-[500px] bg-paper rounded-2xl flex items-center justify-center border border-clay/20 ${className}`}>
        <div className="text-center text-mist">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm">아직 3D 모델이 준비되지 않았습니다.</p>
          <p className="text-xs mt-1">제작 완료 시 여기에 표시됩니다.</p>
        </div>
      </div>
    );
  }

  const handleError = () => {
    setError(true);
  };

  const handleRetry = () => {
    setError(false);
    // key를 바꿔 Canvas/ErrorBoundary를 통째로 재마운트 → 재시도
    setRetryKey((k) => k + 1);
  };

  // 🔥 error 상태를 실제로 화면에 반영 (기존 코드엔 이 분기 자체가 없었음)
  if (error) {
    return (
      <div className={`w-full h-[500px] bg-cream rounded-2xl overflow-hidden border border-clay/20 ${className}`}>
        <ModelError onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className={`w-full h-[500px] bg-cream rounded-2xl overflow-hidden border border-clay/20 relative ${className}`}>
      <ModelErrorBoundary key={retryKey} onError={handleError}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, 1.5]}
          onError={handleError}
        >
          <Suspense fallback={<Html center><ModelLoader /></Html>}>
            <Environment preset="studio" />
            <Stage
              environment="studio"
              intensity={0.6}
              adjustCamera={false}
              shadows={false}
            >
              <Center>
                <MeshModel url={modelUrl} />
              </Center>
            </Stage>
            <OrbitControls
              makeDefault
              enableZoom={true}
              enablePan={false}
              minDistance={2}
              maxDistance={10}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
            />
          </Suspense>
        </Canvas>
      </ModelErrorBoundary>

      {/* 하단 컨트롤 힌트 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-slate border border-clay/20">
        🖱️ 드래그로 회전 · 스크롤로 확대/축소
      </div>
    </div>
  );
}
