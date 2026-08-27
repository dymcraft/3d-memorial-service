'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('별점을 선택해주세요.')
      return
    }

    setSubmitting(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('로그인이 필요합니다.')
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    })

    setSubmitting(false)

    if (insertError) {
      setError('후기 등록에 실패했습니다: ' + insertError.message)
      return
    }

    setRating(0)
    setComment('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-soft mb-8">
      <p className="text-sm font-medium text-ink mb-3">후기 작성</p>

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill={n <= (hoverRating || rating) ? '#B08C3E' : '#E4DFD3'}>
              <path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9 4.4 18l1.4-6.2L1 7.5l6.4-.6z" />
            </svg>
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="제작 후기를 남겨주세요."
        rows={3}
        className="w-full border border-line rounded-xl px-4 py-3 text-sm resize-none mb-3"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink text-stone-paper px-5 py-2.5 rounded-full text-sm hover:bg-seal transition-colors disabled:opacity-50"
      >
        {submitting ? '등록 중...' : '후기 등록'}
      </button>
    </form>
  )
}