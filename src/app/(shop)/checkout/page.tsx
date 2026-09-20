import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import TossPayment from '@/components/payment/TossPayment'

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { productId?: string; options?: string; fail?: string }
}) {
  const { productId, options: optionIdsParam, fail } = searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!productId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-ink-soft">선택된 상품이 없습니다.</p>
        <Link href="/#products" className="text-bronze text-sm mt-4 inline-block">상품 보러가기</Link>
      </div>
    )
  }

  const { data: product } = await supabase
    .from('products')
    .select('*, product_options(*)')
    .eq('id', productId)
    .single()

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-ink-soft">상품 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const selectedIds = (optionIdsParam ?? '').split(',').filter(Boolean)
  const selectedOptions = (product.product_options ?? []).filter((o: any) =>
    selectedIds.includes(o.id)
  )
  const optionsTotal = selectedOptions.reduce((sum: number, o: any) => sum + o.price_delta, 0)
  const total = product.base_price + optionsTotal

  const redirectQuery = `/checkout?productId=${productId}&options=${optionIdsParam ?? ''}`

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink mb-8">주문 확인</h1>

      {fail && (
        <div className="border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-600">
          결제가 취소되었거나 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      <div className="border border-line p-6 mb-6">
        <h2 className="font-display text-lg font-bold text-ink mb-1">{product.name}</h2>
        <p className="text-sm text-ink-soft mb-4">
          {selectedOptions.map((o: any) => o.option_name).join(' · ')}
        </p>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-sm text-ink-soft">총 결제 금액</span>
          <span className="font-display text-xl font-bold text-ink">{total.toLocaleString()}원</span>
        </div>
      </div>

      {!user ? (
        <div className="border border-bronze/30 bg-bronze/5 p-4 mb-6 text-sm text-ink-soft">
          결제 전 로그인이 필요합니다.{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirectQuery)}`} className="text-bronze underline">
            로그인하러 가기
          </Link>
        </div>
      ) : (
        <TossPayment
          productId={productId}
          optionIds={selectedIds}
          amount={total}
          orderName={product.name}
          customerName={user.email ?? undefined}
        />
      )}
    </div>
  )
}
