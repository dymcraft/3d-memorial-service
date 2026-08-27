'use client';

import { Component, ReactNode } from 'react';

interface ModelErrorBoundaryProps {
  children: ReactNode;
  onError: () => void;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

// 🔥 Canvas 내부(useGLTF 등 Suspense 기반 훅)에서 발생하는
// "진짜" 로딩 실패(네트워크 오류, 손상된 gltf 파일 등)만 잡아냅니다.
// Suspense의 정상적인 Promise throw는 여기서 걸리지 않고
// 상위 <Suspense fallback={...}>가 정상 처리합니다.
export default class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('3D 모델 로드 실패:', error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      // 실제 에러 UI는 부모(ModelViewer)가 error 상태를 보고 그린다.
      // 여기서는 리액트 트리가 깨지지 않도록 null만 반환.
      return null;
    }
    return this.props.children;
  }
}
