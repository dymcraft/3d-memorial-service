'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (버킷 기본 제한과 동일)

export default function ModelUploadForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setError('');

    if (selected && !selected.name.toLowerCase().endsWith('.glb')) {
      setError('.glb 파일만 업로드할 수 있습니다.');
      setFile(null);
      return;
    }

    if (selected && selected.size > MAX_FILE_SIZE) {
      setError('파일 용량이 50MB를 초과합니다.');
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('업로드할 .glb 파일을 선택해주세요.');
      return;
    }

    setUploading(true);
    setError('');
    const supabase = createClient();

    try {
      setProgressText('파일 업로드 중...');
      const path = `${orderId}/model-${Date.now()}.glb`;

      const { error: uploadError } = await supabase.storage
        .from('order-models')
        .upload(path, file);

      if (uploadError) {
        setError('모델 파일 업로드 실패: ' + uploadError.message);
        setUploading(false);
        return;
      }

      // order-models는 public 버킷이므로 바로 공개 URL을 만들 수 있다.
      const { data: publicUrlData } = supabase.storage
        .from('order-models')
        .getPublicUrl(path);

      setProgressText('주문 정보 갱신 중...');

      const res = await fetch(`/api/admin/orders/${orderId}/model`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelUrl: publicUrlData.publicUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '주문 정보 갱신에 실패했습니다.');
        setUploading(false);
        return;
      }

      router.push(`/admin/orders/${orderId}`);
      router.refresh();
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다.');
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="border border-clay/20 bg-cream/50 p-4 rounded-xl text-xs text-slate">
        📌 .glb 형식(단일 파일 3D 모델)만 업로드 가능합니다. 업로드 완료 시 주문 상태가
        자동으로 "고객 확인 대기"로 전환됩니다.
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">3D 모델 파일 (.glb)</label>
        <input
          type="file"
          accept=".glb"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full text-sm"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {uploading && progressText && <p className="text-slate text-sm">{progressText}</p>}

      <button
        type="submit"
        disabled={uploading || !file}
        className="w-full py-3 bg-charcoal text-white rounded-xl text-sm font-medium hover:bg-charcoal/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? '업로드 중...' : '업로드 완료'}
      </button>
    </form>
  );
}
