import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'

export default async function ReviewSection({ productId }: { productId: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: reviews } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  const count = reviews?.length ?? 0
  const average = count > 0 ? reviews!.reduce((sum, r) => sum + r.rating, 0) / count : 0

  return (
    <section className="py-16 border-t border-line">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-display text-xl font-bold text-ink">후기</h2>
        {count > 0 && (
          <>
            <StarRating rating={average} size={16} />
            <span className="text-sm text-ink-soft">
              {average.toFixed(1)} ({count})
            </span>
          </>
        )}
      </div>

      {user ? (
        <ReviewForm productId={productId} />
      ) : (
        <div className="border border-line rounded-2xl p-5 text-sm text-ink-soft mb-8">
          <Link href={`/login?redirect=/products/${productId}`} className="text-bronze underline">
            로그인
          </Link>{' '}
          후 후기를 남길 수 있습니다.
        </div>
      )}

      {count > 0 ? (
        <div className="flex flex-col gap-4">
          {reviews!.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-ink-soft/60">
                  고객{review.user_id.slice(0, 4)}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-ink-soft leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-soft/70 text-center py-8">
          아직 등록된 후기가 없습니다.
        </p>
      )}
    </section>
  )
}