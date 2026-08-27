import Link from 'next/link'
import ProductImage from './ProductImage'
import { OCCASIONS, CATEGORY_LABELS, ACCENT_HEX } from '@/lib/utils/constants'

const BADGE_BG: Record<string, string> = {
  bronze: 'bg-bronze/10 text-bronze',
  gold: 'bg-gold/10 text-gold',
  rose: 'bg-rose/10 text-rose',
  sage: 'bg-sage/10 text-sage',
  ink: 'bg-ink/10 text-ink',
}

export default function ProductCard({ product }: { product: any }) {
  const materials = product.product_options?.filter((o: any) => o.option_type === 'MATERIAL')
  const primaryTag = product.occasion_tags?.[0]
  const occasion = OCCASIONS.find((o) => o.code === primaryTag)
  const accent = occasion?.accent ?? 'ink'

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-medium transition-shadow duration-300"
    >
      <ProductImage
        src={product.thumbnail_url}
        category={product.category}
        alt={product.name}
        accentHex={ACCENT_HEX[accent]}
      />

      <div className="pt-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${BADGE_BG[accent]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {occasion?.label ?? CATEGORY_LABELS[product.category]}
          </span>
          <span className="text-[11px] text-ink-soft/60">{CATEGORY_LABELS[product.category] ?? product.category}</span>
        </div>

        <h3 className="font-display text-lg font-bold text-ink mb-1.5">{product.name}</h3>
        <p className="text-sm text-ink-soft leading-relaxed line-clamp-2 mb-4">{product.description}</p>
        <p className="text-xs text-ink-soft/70 mb-4">
          재질 {materials?.map((m: any) => m.option_name).join(' · ')}
        </p>

        <div className="flex items-baseline justify-between pt-4 border-t border-line">
          <span className="text-xs text-ink-soft">기본가</span>
          <span className="font-display text-xl font-bold text-ink">
            {product.base_price.toLocaleString()}원~
          </span>
        </div>
      </div>
    </Link>
  )
}