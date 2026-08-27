import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-xs tracking-widest text-bronze uppercase mb-4">404</p>
      <h1 className="font-display text-2xl font-bold text-ink mb-3">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-ink-soft mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="bg-ink text-stone-paper px-6 py-3 text-sm hover:bg-bronze-deep transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}