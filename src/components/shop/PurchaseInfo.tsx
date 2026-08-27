'use client'

import { useState } from 'react'

const items = [
  {
    title: '제작 기간 안내',
    content: '사진 전달 후 시안 확인까지 1~2일, 승인 후 제작·배송까지 약 1~2주 소요됩니다.',
  },
  {
    title: '환불 및 교환 안내',
    content: '3D 시안 확인 전(제작 착수 전)에는 전액 환불이 가능합니다. 시안 승인 후에는 맞춤 제작 특성상 단순 변심에 의한 환불이 제한되며, 파손·불량 등 제작 하자에 대해서는 무상 교환해드립니다.',
  },
  {
    title: '배송 안내',
    content: '전국 택배 배송이며, 제작 완료 후 2~3일 이내 발송됩니다. 파손 방지를 위해 전용 포장재로 안전하게 배송해드립니다.',
  },
]

export default function PurchaseInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 border-t border-line">
      <h2 className="font-display text-xl font-bold text-ink mb-6">구매 안내</h2>
      {items.map((item, i) => (
        <div key={item.title} className="border-b border-line">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="text-sm font-medium text-ink">{item.title}</span>
            <span className="text-ink-soft text-lg">{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && (
            <p className="text-sm text-ink-soft leading-relaxed pb-4">{item.content}</p>
          )}
        </div>
      ))}
    </section>
  )
}