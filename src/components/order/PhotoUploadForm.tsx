'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PhotoUploadForm({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [sideFile, setSideFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!frontFile || !sideFile) {
      setError('정면, 측면 사진을 모두 선택해주세요.')
      return
    }

    setUploading(true)
    setError('')
    const supabase = createClient()

    const frontPath = `${orderId}/front-${Date.now()}.jpg`
    const sidePath = `${orderId}/side-${Date.now()}.jpg`

    const { error: frontError } = await supabase.storage
      .from('order-photos')
      .upload(frontPath, frontFile)

    if (frontError) {
      setUploading(false)
      setError('정면 사진 업로드 실패: ' + frontError.message)
      return
    }

    const { error: sideError } = await supabase.storage
      .from('order-photos')
      .upload(sidePath, sideFile)

    if (sideError) {
      setUploading(false)
      setError('측면 사진 업로드 실패: ' + sideError.message)
      return
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        photo_urls: [frontPath, sidePath],
        current_step: 'AI_PROCESSING',
        step_updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    setUploading(false)

    if (updateError) {
      setError('주문 정보 업데이트 실패: ' + updateError.message)
      return
    }

    router.push(`/order/${orderId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="border border-line p-4 text-xs text-ink-soft">
        📌 화질 가이드: 밝은 곳에서 촬영한 정면·측면 사진 각 1장, 역광 금지, 얼굴이 선명하게 보이는 사진을 올려주세요.
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">정면 사진</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFrontFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">측면 사진</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSideFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-ink text-stone-paper py-3 text-sm hover:bg-bronze-deep transition-colors disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '업로드 완료'}
      </button>
    </form>
  )
}