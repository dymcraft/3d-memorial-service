import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MobileNav from './MobileNav'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 🔥 관리자 권한 확인 (서버 컴포넌트에서 직접 처리)
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  const navItems = [
    { label: '홈', href: '/' },
    { label: '상품', href: '/#products' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-stone-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔥 헤더 높이 - 모바일 14(56px), PC 16(64px) */}
        <div className="flex items-center justify-between h-14 sm:h-16 relative">
          {/* 🔥 로고 - 모바일에서 약간 작게 */}
          <Link 
            href="/" 
            className="font-display text-base sm:text-lg font-bold text-ink hover:text-bronze transition-colors"
          >
            메모리얼 스튜디오
          </Link>

          {/* 🔥 PC용 네비게이션 (md 이상에서만 표시) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-ink-soft hover:text-bronze transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-ink-soft hover:text-bronze transition-colors"
                >
                  마이페이지
                </Link>

                {/* 🔥 관리자만 보이는 메뉴 */}
                {isAdmin && (
                  <Link
                    href="/admin/orders"
                    className="text-sm text-bronze font-medium hover:text-bronze-deep transition-colors"
                  >
                    ⚙️ 관리자
                  </Link>
                )}

                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-ink text-stone-paper px-4 py-2 rounded-full hover:bg-seal transition-colors"
              >
                로그인
              </Link>
            )}
          </nav>

          {/* 🔥 모바일 네비게이션 (md 미만에서 표시) */}
          <MobileNav navItems={navItems} isLoggedIn={!!user} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  )
}