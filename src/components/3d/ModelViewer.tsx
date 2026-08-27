'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Center, Environment, Html } from '@react-three/drei';
import ModelLoader from './ModelLoader';
import ModelError from './ModelError';
import ModelErrorBoundary from './ModelErrorBoundary';

interface ModelViewerProps {
  modelUrl: string | null;
  autoRotate?: boolean;
  className?: string;
  lazy?: boolean; // 🔥 추가: lazy 로딩 활성화 여부
}

// 3D 메쉬 컴포넌트
function MeshModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function ModelViewer({
  modelUrl,
  autoRotate = true,
  className = '',
  lazy = true, // 🔥 기본값 true (lazy loading 활성화)
}: ModelViewerProps) {
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [isVisible, setIsVisible] = useState(!lazy); // 🔥 lazy면 처음엔 false

  // 🔥 Intersection Observer로 뷰포트에 들어올 때 로딩 시작
  useEffect(() => {
    if (!lazy || !modelUrl) return;

    const element = document.getElementById('model-viewer-container');
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // 🔥 200px 전에 미리 로딩 시작
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [lazy, modelUrl]);

  if (!modelUrl) {
    return (
      <div 
        id="model-viewer-container"
        className={`w-full h-[500px] bg-paper rounded-2xl flex items-center justify-center border border-clay/20 ${className}`}
      >
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
    setRetryKey((k) => k + 1);
  };

  if (error) {
    return (
      <div 
        id="model-viewer-container"
        className={`w-full h-[500px] bg-cream rounded-2xl overflow-hidden border border-clay/20 ${className}`}
      >
        <ModelError onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div 
      id="model-viewer-container"
      className={`w-full h-[500px] bg-cream rounded-2xl overflow-hidden border border-clay/20 relative ${className}`}
    >
      {!isVisible ? (
        // 🔥 로딩 전 플레이스홀더 (lazy loading)
        <div className="w-full h-full flex items-center justify-center bg-cream">
          <div className="text-center text-mist">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-sm">3D 모델 로딩 대기 중...</p>
            <p className="text-xs mt-1">스크롤하면 자동으로 로드됩니다</p>
          </div>
        </div>
      ) : (
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
      )}

      {/* 하단 컨트롤 힌트 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-slate border border-clay/20">
        🖱️ 드래그로 회전 · 스크롤로 확대/축소
      </div>
    </div>
  );
}