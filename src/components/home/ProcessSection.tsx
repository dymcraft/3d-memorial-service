const steps = [
  {
    num: '01',
    title: '상품 선택',
    duration: '즉시',
    desc: '원하시는 형태(흉상/전신상/캐리커처/커플/반려동물/개업기념 등)를 고르고, 재질·케이스·사이즈까지 취향에 맞게 조합해보세요. 조합에 따라 예상 금액이 실시간으로 계산되어, 예산에 맞춰 편하게 결정하실 수 있습니다.',
    // 웹사이트 옵션 선택 화면 캡처가 필요합니다 (실사진 준비 전 placeholder)
    images: ['https://placehold.co/700x500/f6f4ef/8c6f4e?text=Step+1+Screenshot'],
  },
  {
    num: '02',
    title: '사진 전달',
    duration: '즉시',
    desc: '결제 후 정면·측면 사진 각 1장을 업로드해주세요. 밝은 곳에서 촬영한, 역광 없이 얼굴이 선명하게 나온 사진일수록 완성도가 높아집니다. 사진 전달과 동시에 제작이 바로 시작됩니다.',
    // 사진 업로드 화면 캡처가 필요합니다 (실사진 준비 전 placeholder)
    images: ['https://placehold.co/700x500/f6f4ef/8c6f4e?text=Step+2+Screenshot'],
  },
  {
    num: '03',
    title: '3D 시안 확인',
    duration: '1~2일',
    desc: 'AI 기반 3D 모델링이 완료되면, 화면에서 360도로 자유롭게 돌려보며 얼굴 각도·표정·비율까지 꼼꼼히 확인하실 수 있습니다. 마음에 들지 않는 부분은 수정 요청도 가능하며, 승인 전까지는 실제 출력이 진행되지 않아 안심하고 확인하실 수 있습니다.',
    images: ['/images/process/step3-3d-review.jpg'],
  },
  {
    num: '04',
    title: '제작 및 배송',
    duration: '1~2주',
    desc: '시안 승인 후, 3D 프린터로 정밀 출력하고 숙련된 작업자가 한 땀 한 땀 손으로 도색합니다. 완성된 조형물은 눈·코·입 등 디테일까지 놓치지 않는 최종 품질 검수를 거친 뒤, 파손 방지 전용 포장재로 안전하게 포장되어 배송됩니다.',
    images: [
      { src: '/images/process/step4a-print.jpg', label: '3D 프린팅' },
      { src: '/images/process/step4b-painting.jpg', label: '수작업 도색' },
      { src: '/images/process/step4c-inspection.jpg', label: '최종 품질 검수' },
      { src: '/images/process/step4d-packaging.jpg', label: '안전 포장' },
    ],
  },
]

export default function ProcessSection() {
  return (
    <section className="py-20 border-t border-line">
      <div className="mb-14 text-center">
        <p className="text-xs tracking-[0.2em] text-seal uppercase mb-2">Process</p>
        <h2 className="font-display text-2xl font-bold text-ink">제작 과정</h2>
        <p className="text-sm text-ink-soft mt-2">주문부터 배송까지, 4단계로 안심하고 맡기세요</p>
      </div>

      <div className="flex flex-col gap-20">
        {steps.map((step, idx) => {
          const isReversed = idx % 2 === 1
          const isMultiImage = Array.isArray(step.images) && typeof step.images[0] !== 'string'

          return (
            <div
              key={step.num}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* 이미지 영역 */}
              <div className={isReversed ? 'md:order-2' : 'md:order-1'}>
                {isMultiImage ? (
                  <div className="grid grid-cols-2 gap-3">
                    {(step.images as { src: string; label: string }[]).map((img) => (
                      <div key={img.src} className="relative rounded-2xl overflow-hidden shadow-medium">
                        <img src={img.src} alt={img.label} className="w-full h-40 sm:h-48 object-cover" />
                        <span className="absolute bottom-0 left-0 right-0 bg-ink/70 text-stone-paper text-[11px] text-center py-1">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden shadow-medium">
                    <img
                      src={(step.images as string[])[0]}
                      alt={step.title}
                      className="w-full h-72 sm:h-96 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* 텍스트 영역 */}
              <div className={isReversed ? 'md:order-1' : 'md:order-2'}>
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-display text-4xl font-bold text-bronze/25">{step.num}</p>
                  {/* 🔥 FORMICK 참고: 단계별 예상 소요기간을 숫자로 명시해서 신뢰도를 높임 */}
                  <span className="text-[11px] font-medium text-seal bg-seal/10 px-2.5 py-1 rounded-full">
                    예상 소요기간 {step.duration}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
