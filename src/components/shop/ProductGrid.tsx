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
      <div className="flex flex-wrap gap-2 mb-8">
        {OCCASIONS.map((o) => (
          <button
            key={o.code}
            onClick={() => setFilter(o.code)}
            className={`text-xs px-4 py-2 rounded-full border border-line transition-colors ${
              filter === o.code ? CHIP_ACTIVE[o.accent] : 'bg-white text-ink-soft hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

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