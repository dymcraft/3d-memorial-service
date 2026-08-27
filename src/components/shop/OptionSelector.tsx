'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type ProductOption = {
  id: string
  option_type: string
  option_name: string
  price_delta: number
  display_order: number
}

const TYPE_LABELS: Record<string, string> = {
  MATERIAL: '재질',
  CASE: '케이스',
  SIZE: '사이즈',
}

export default function OptionSelector({
  productId,
  basePrice,
  options,
}: {
  productId: string
  basePrice: number
  options: ProductOption[]
}) {
  const router = useRouter()

  // 옵션을 종류(option_type)별로 자동 그룹핑 — SIZE든 뭐든 새 종류가 추가돼도 코드 수정 불필요
  const groups = useMemo(() => {
    const map: Record<string, ProductOption[]> = {}
    for (const opt of options) {
      if (!map[opt.option_type]) map[opt.option_type] = []
      map[opt.option_type].push(opt)
    }
    Object.values(map).forEach((list) => list.sort((a, b) => a.display_order - b.display_order))
    return map
  }, [options])

  const groupTypes = Object.keys(groups)

  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    groupTypes.forEach((type) => {
      initial[type] = groups[type][0]?.id ?? ''
    })
    return initial
  })

  const totalPrice = useMemo(() => {
    let total = basePrice
    for (const type of groupTypes) {
      const selectedId = selections[type]
      const opt = groups[type].find((o) => o.id === selectedId)
      total += opt?.price_delta ?? 0
    }
    return total
  }, [selections, groups, groupTypes, basePrice])

  function handleCheckout() {
    const selectedIds = Object.values(selections).join(',')
    const query = new URLSearchParams({ productId, options: selectedIds })
    router.push(`/checkout?${query.toString()}`)
  }

  return (
    <div>
      {groupTypes.map((type) => (
        <div key={type} className="mb-6">
          <p className="text-sm font-medium text-ink mb-3">{TYPE_LABELS[type] ?? type}</p>
          <div className="flex flex-col gap-2">
            {groups[type].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between border px-4 py-3 cursor-pointer transition-colors ${
                  selections[type] === opt.id ? 'border-bronze bg-bronze/5' : 'border-line hover:border-ink-soft'
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={type}
                    checked={selections[type] === opt.id}
                    onChange={() => setSelections((prev) => ({ ...prev, [type]: opt.id }))}
                    className="accent-bronze"
                  />
                  <span className="text-sm text-ink">{opt.option_name}</span>
                </span>
                <span className="text-xs text-ink-soft">
                  {opt.price_delta > 0 ? `+${opt.price_delta.toLocaleString()}원` : '기본'}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-line pt-6">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm text-ink-soft">총 금액</span>
          <span className="font-display text-2xl font-bold text-ink">{totalPrice.toLocaleString()}원</span>
        </div>
        <button onClick={handleCheckout} className="w-full bg-ink text-stone-paper py-3 text-sm hover:bg-bronze-deep transition-colors">
          이 옵션으로 주문하기
        </button>
      </div>
    </div>
  )
}