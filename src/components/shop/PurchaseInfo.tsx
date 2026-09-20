'use client'

import { useState } from 'react'

const items = [
  {
    title: '제작 기간 안내',
    content: '사진 전달 후 시안 확인까지 1~2일, 승인 후 제작·배송까지 약 1~2주 소요됩니다.',
    image: '/images/process/step4a-print.jpg',
  },
  {
    title: '환불 및 교환 안내',
    content:
      '3D 시안 확인 전(제작 착수 전)에는 전액 환불이 가능합니다. 시안 승인 후에는 맞춤 제작 특성상 단순 변심에 의한 환불이 제한됩니다. 제품 품질보증기간은 발송일로부터 6개월이며, 배송 중 파손이나 제작 하자가 확인되면 접수 후 신속하게 무상 재제작·교환해드립니다.',
    image: '/images/purchase-info/quality-check.jpg',
  },
  {
    title: '배송 안내',
    content: '전국 택배 배송이며, 제작 완료 후 2~3일 이내 발송됩니다. 파손 방지를 위해 전용 포장재로 안전하게 배송해드립니다.',
    image: '/images/purchase-info/packaging.jpg',
  },
  {
    // 🔥 FORMICK의 "주의사항" 체크리스트를 참고해 우리 제품(레진/PLA 소재) 기준으로 새로 작성.
    // 미리 솔직하게 고지해서 나중에 오해로 인한 클레임을 줄이는 목적입니다.
    title: '제작 전 꼭 확인해주세요',
    content: [
      '사진 기반 3D 모델링 특성상, 실제 모습과 세부적인 부분에서 다소 차이가 있을 수 있습니다.',
      '3D 시안을 승인하신 이후에는 제작이 바로 시작되어 추가 수정이 어려울 수 있으니, 승인 전 얼굴 각도·표정·비율을 꼼꼼히 확인해주세요.',
      '레진·PLA 소재 특성상 색상이 사진과 미세하게 다르게 표현될 수 있습니다.',
      '직사광선에 오래 노출되면 변색될 수 있어, 그늘진 실내 공간에 보관하시길 권장드립니다.',
      '낙하 등 강한 충격에는 파손될 수 있으니, 안전한 곳에 보관·전시해주세요.',
      '총 제작기간은 시안 승인일 기준 약 1~2주이며, 옵션이나 제작 상황에 따라 다소 변동될 수 있습니다.',
    ],
    image: null as string | null,
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
            <div className="pb-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full max-w-md h-40 object-cover rounded-xl mb-3"
                />
              )}
              {Array.isArray(item.content) ? (
                <ul className="space-y-2">
                  {item.content.map((line, idx) => (
                    <li key={idx} className="text-sm text-ink-soft leading-relaxed flex gap-2">
                      <span className="text-bronze flex-shrink-0">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-soft leading-relaxed">{item.content}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
