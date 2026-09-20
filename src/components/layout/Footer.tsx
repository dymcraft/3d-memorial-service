import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-line mt-20 bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* 🔥 상단: 브랜드 + 링크 */}
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
          {/* 브랜드 */}
          <div className="flex-shrink-0">
            <p className="font-display text-base sm:text-lg font-bold text-ink">
              메모리얼 스튜디오
            </p>
            <p className="text-xs text-ink-soft mt-1">
              3D 프린팅 기념 조형물 제작
            </p>
          </div>

          {/* 🔥 링크 - 모바일에서도 잘리지 않도록 flex-wrap + 적절한 간격 */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-ink-soft">
            <Link 
              href="/terms" 
              className="hover:text-bronze transition-colors whitespace-nowrap"
            >
              이용약관
            </Link>
            <Link 
              href="/privacy" 
              className="hover:text-bronze transition-colors whitespace-nowrap"
            >
              개인정보처리방침
            </Link>
            <a 
              href="mailto:dh.yoon@dymcraft.com"
              className="hover:text-bronze transition-colors whitespace-nowrap"
            >
              문의하기
            </a>
          </div>
        </div>

        {/* 🔥 사업자 정보 (구분선) */}
        <div className="border-t border-line mt-8 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs text-ink-soft/80 leading-relaxed">
            <p>
              <span className="text-ink-soft/60">상호</span> : 디와이엠크래프트 (DYMCraft)
            </p>
            <p>
              <span className="text-ink-soft/60">대표</span> : 도재영
            </p>
            <p>
              <span className="text-ink-soft/60">사업자등록번호</span> : 259-38-00264
            </p>
            <p>
              <span className="text-ink-soft/60">통신판매업신고</span> : 제 2026-서울강남-0000호
            </p>
            <p className="sm:col-span-2">
              <span className="text-ink-soft/60">주소</span> : 경기 성남시 수정구 고등로 3 A240
            </p>
            <p>
              <span className="text-ink-soft/60">이메일</span> :{' '}
              <a 
                href="mailto:dh.yoon@dymcraft.com"
                className="hover:text-bronze transition-colors"
              >
                dh.yoon@dymcraft.com
              </a>
            </p>
            <p>
              <span className="text-ink-soft/60">전화</span> : 02-0000-0000
            </p>
          </div>
        </div>

        {/* 🔥 카피라이트 */}
        <div className="border-t border-line mt-6 pt-6">
          <p className="text-xs text-ink-soft/60 text-center sm:text-left">
            © 2026 DYMCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}