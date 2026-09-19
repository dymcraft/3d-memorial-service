'use client'

import { useState } from 'react'
import { OCCASIONS } from '@/lib/utils/constants'
import ProductCard from './ProductCard'

const CHIP_ACTIVE: Record<string, string> = {
  ink: 'bg-ink text-white',
  bronze: 'bg-bronze text-white',
  gold: 'bg-gold text-white',
  rose: 'bg-rose text-white',
  sage: 'bg-sage text-white',
}

export default function ProductGrid({ products }: { products: any[] }) {
  const [filter, setFilter] = useState('ALL')

  const filtered =
    filter === 'ALL' ? products : products.filter((p) => p.occasion_tags?.includes(filter))

  return (
    <div>
      {/* 🔥 필터 칩 - 모바일에서 가로 스크롤 가능하게 + 터치 영역 확대 */}
      <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-x-visible">
        {OCCASIONS.map((o) => (
          <button
            key={o.code}
            onClick={() => setFilter(o.code)}
            className={`flex-shrink-0 text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-2 rounded-full border border-line transition-colors whitespace-nowrap ${
              filter === o.code ? CHIP_ACTIVE[o.accent] : 'bg-white text-ink-soft hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 🔥 상품 그리드 - 모바일 1열, 태블릿 2열, PC 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-ink-soft py-12">해당 용도의 상품이 아직 없습니다.</p>
      )}
    </div>
  )
}