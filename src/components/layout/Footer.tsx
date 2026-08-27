import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <p className="font-display text-sm text-ink">메모리얼 스튜디오</p>
          <div className="flex gap-6 text-xs text-ink-soft">
            <Link href="/terms" className="hover:text-bronze transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-bronze transition-colors">개인정보처리방침</Link>
            <span>문의: dh.yoon@dymcraft.com</span>
          </div>
        </div>
        <p className="text-xs text-ink-soft/60 mt-6">
          © 2026 DYMCraft. All rights reserved.
        </p>
      </div>
    </footer>
  )
}