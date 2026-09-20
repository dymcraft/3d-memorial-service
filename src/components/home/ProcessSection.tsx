const steps = [
  {
    num: '01',
    title: '상품 선택',
    desc: '원하시는 형태(흉상/전신상/캐리커처 등)와 재질, 사이즈를 선택하고 결제합니다.',
    image: 'https://placehold.co/400x300/f6f4ef/8c6f4e?text=Step+1',
  },
  {
    num: '02',
    title: '사진 전달',
    desc: '정면·측면 사진을 업로드해주시면, 제작이 바로 시작됩니다.',
    image: 'https://placehold.co/400x300/f6f4ef/8c6f4e?text=Step+2',
  },
  {
    num: '03',
    title: '3D 시안 확인',
    desc: '3D 모델링 완료 후, 화면에서 360도로 돌려보며 확인하고 승인해주세요.',
    image: 'https://placehold.co/400x300/f6f4ef/8c6f4e?text=Step+3',
  },
  {
    num: '04',
    title: '제작 및 배송',
    desc: '승인 후 프린팅·후가공을 거쳐 안전하게 포장해 배송해드립니다.',
    image: 'https://placehold.co/400x300/f6f4ef/8c6f4e?text=Step+4',
  },
]

export default function ProcessSection() {
  return (
    <section className="py-16 border-t border-line">
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] text-seal uppercase mb-2">Process</p>
        <h2 className="font-display text-xl font-bold text-ink">제작 과정</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step) => (
          <div key={step.num} className="bg-white rounded-2xl overflow-hidden shadow-soft">
            {/* 🔥 실사진 준비되면 image 값만 교체하면 됩니다 */}
            <img src={step.image} alt={step.title} className="w-full h-32 object-cover" />
            <div className="p-5">
              <p className="font-display text-2xl font-bold text-bronze/25 mb-2">{step.num}</p>
              <h3 className="font-display text-sm font-bold text-ink mb-1.5">{step.title}</h3>
              <p className="text-xs text-ink-soft leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
