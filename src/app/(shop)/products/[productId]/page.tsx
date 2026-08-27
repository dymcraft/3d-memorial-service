import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import OptionSelector from '@/components/shop/OptionSelector'
import ProductImage from '@/components/shop/ProductImage'
import ProcessSection from '@/components/home/ProcessSection'
import PurchaseInfo from '@/components/shop/PurchaseInfo'
import ReviewSection from '@/components/shop/ReviewSection'
import { OCCASIONS, ACCENT_HEX } from '@/lib/utils/constants'

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string }
}) {
  const { productId } = params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_options(*)')
    .eq('id', productId)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  const primaryTag = product.occasion_tags?.[0]
  const occasion = OCCASIONS.find((o) => o.code === primaryTag)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/#products" className="text-xs text-ink-soft hover:text-bronze mb-8 inline-block">
        ← 상품 목록으로
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImage
          src={product.thumbnail_url}
          category={product.category}
          alt={product.name}
          accentHex={ACCENT_HEX[occasion?.accent ?? 'ink']}
        />

        <div>
          <p className="text-xs tracking-widest text-bronze uppercase mb-2">
            {occasion?.label ?? product.category}
          </p>
          <h1 className="font-display text-2xl font-bold text-ink mb-3">{product.name}</h1>
          <p className="text-sm text-ink-soft mb-8">{product.description}</p>

          <OptionSelector
            productId={product.id}
            basePrice={product.base_price}
            options={product.product_options ?? []}
          />
        </div>
      </div>

      <ProcessSection />
      <PurchaseInfo />
      <ReviewSection productId={product.id} />
    </div>
  )
}