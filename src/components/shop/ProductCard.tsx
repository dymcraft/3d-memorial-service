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
      className="group block bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-soft hover:shadow-medium transition-shadow duration-300"
    >
      {/* 🔥 모바일: 이미지 상단 전체 너비 / PC: 기존과 동일 */}
      <div className="w-full">
        <ProductImage
          src={product.thumbnail_url}
          category={product.category}
          alt={product.name}
          accentHex={ACCENT_HEX[accent]}
        />
      </div>

      <div className="pt-3 sm:pt-4 md:pt-5">
        {/* 🔥 태그 영역 - 모바일에서 좌우 배치 유지 */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${BADGE_BG[accent]}`}>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-current" />
            {occasion?.label ?? CATEGORY_LABELS[product.category]}
          </span>
          <span className="text-[10px] sm:text-[11px] text-ink-soft/60">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
        </div>

        {/* 🔥 제목 - 모바일에서 약간 작게 */}
        <h3 className="font-display text-base sm:text-lg font-bold text-ink mb-1 sm:mb-1.5 leading-snug">
          {product.name}
        </h3>

        {/* 🔥 설명 - 모바일에서 2줄 제한 */}
        <p className="text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-2 mb-2 sm:mb-4">
          {product.description}
        </p>

        {/* 🔥 재질 - 모바일에서 더 작게 */}
        <p className="text-[10px] sm:text-xs text-ink-soft/70 mb-2 sm:mb-4">
          재질 {materials?.map((m: any) => m.option_name).join(' · ')}
        </p>

        {/* 🔥 가격 - 모바일에서 크기 조정 */}
        <div className="flex items-baseline justify-between pt-2 sm:pt-4 border-t border-line">
          <span className="text-[10px] sm:text-xs text-ink-soft">기본가</span>
          <span className="font-display text-base sm:text-xl font-bold text-ink">
            {product.base_price.toLocaleString()}원~
          </span>
        </div>
      </div>
    </Link>
  )
}