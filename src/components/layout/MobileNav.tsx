'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

type NavItem = { label: string; href: string }

export default function MobileNav({
  navItems,
  isLoggedIn,
  isAdmin,
}: {
  navItems: NavItem[]
  isLoggedIn: boolean
  isAdmin?: boolean
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 🔥 페이지 이동 시 자동으로 메뉴 닫기
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // 🔥 메뉴 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="md:hidden">
      {/* 🔥 햄버거 버튼 - 터치 영역 확대 */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 -mr-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-ink/5 transition-colors"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {/* 🔥 배경 오버레이 (메뉴 열렸을 때) */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm top-14 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 🔥 모바일 메뉴 패널 */}
      {open && (
        <nav className="absolute left-0 right-0 top-14 bg-stone-paper border-b border-line shadow-medium z-50 px-4 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center min-h-[48px] px-3 -mx-1 rounded-lg text-base text-ink-soft hover:text-bronze hover:bg-ink/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center min-h-[48px] px-3 -mx-1 rounded-lg text-base text-ink-soft hover:text-bronze hover:bg-ink/5 transition-colors"
              >
                마이페이지
              </Link>

              {/* 🔥 관리자만 보이는 모바일 메뉴 */}
              {isAdmin && (
                <Link
                  href="/admin/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center min-h-[48px] px-3 -mx-1 rounded-lg text-base text-bronze font-medium hover:text-bronze-deep hover:bg-bronze/5 transition-colors"
                >
                  ⚙️ 관리자
                </Link>
              )}

              <div className="min-h-[48px] px-3 -mx-1 flex items-center">
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center min-h-[48px] mt-2 px-4 bg-ink text-stone-paper text-base font-medium rounded-full hover:bg-seal transition-colors"
            >
              로그인
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}