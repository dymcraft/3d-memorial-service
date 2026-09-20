const occasions = [
  {
    code: 'MEMORIAL',
    image: '/images/occasions/1.jpg',
    headline: '그리운 마음을, 손끝으로 다시 만날 수 있도록',
    desc: '사진 속에 머물던 모습을 입체로 되살려, 가까이 두고 마주할 수 있는 존재로 남깁니다.',
    moments: '기일 · 49재 · 생신 · 문득 보고 싶은 어느 날',
  },
  {
    code: 'CELEBRATION',
    image: '/images/occasions/2.jpg',
    headline: '축하하는 마음을, 오래 남는 형태로',
    desc: '그 순간의 표정과 분위기를 그대로 담아, 책상 위에서도 계속 떠올릴 수 있게 합니다.',
    moments: '승진 · 개업 · 졸업 · 정년 퇴임',
  },
  {
    code: 'PET',
    image: '/images/occasions/3.jpg',
    headline: '짧았던 함께의 시간을, 곁에 오래 두는 방법',
    desc: '털의 결과 표정 하나까지, 우리 아이만의 특징을 담아 미니어처로 남깁니다.',
    moments: '함께한 첫 기념일 · 무지개다리를 건넌 아이를 기억하며',
  },
  {
    code: 'COUPLE',
    image: '/images/occasions/4.jpg',
    headline: '둘만의 순간을, 손안에 담을 수 있게',
    desc: '프러포즈, 웨딩, 기념일의 표정을 그대로 재현해, 매일 마주 볼 수 있는 조형물로 만듭니다.',
    moments: '프러포즈 · 웨딩 · 100일·1주년',
  },
]

export default function OccasionSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.2em] text-seal uppercase mb-2">Moments</p>
        <h2 className="font-display text-2xl font-bold text-ink">이런 순간, 이렇게 오래 간직하세요</h2>
        <p className="text-sm text-ink-soft mt-2">
          사진 한 장이면 충분합니다 — 그 안의 마음까지 조형물에 담아드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {occasions.map((item) => (
          <div key={item.code} className="rounded-2xl overflow-hidden shadow-soft bg-white">
            {/* 🔥 임시 자리표시 이미지(1~4.jpg)입니다. 실사진 준비되면 파일명 그대로
                public/images/occasions/ 안의 같은 번호 파일만 교체하면 됩니다. */}
            <img src={item.image} alt={item.headline} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="font-display text-base font-bold text-ink mb-2">{item.headline}</h3>
              <p className="text-sm text-ink-soft leading-relaxed mb-3">{item.desc}</p>
              <p className="text-xs text-bronze">{item.moments}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
