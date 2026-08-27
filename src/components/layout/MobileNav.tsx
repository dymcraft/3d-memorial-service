'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

type NavItem = { label: string; href: string }

export default function MobileNav({
  navItems,
  isLoggedIn,
  isAdmin, // 🔥 추가: 관리자 여부
}: {
  navItems: NavItem[]
  isLoggedIn: boolean
  isAdmin?: boolean // 선택적 prop으로 추가
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="p-2 -mr-2" aria-label="메뉴 열기">
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

      {open && (
        <nav className="absolute left-0 right-0 top-16 bg-stone-paper border-b border-line px-4 pb-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-ink-soft hover:text-bronze transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-ink-soft hover:text-bronze transition-colors"
              >
                마이페이지
              </Link>

              {/* 🔥 관리자만 보이는 모바일 메뉴 */}
              {isAdmin && (
                <Link
                  href="/admin/orders"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-bronze font-medium hover:text-bronze-deep transition-colors"
                >
                  ⚙️ 관리자
                </Link>
              )}

              <div className="py-2">
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="py-2 text-sm text-bronze font-medium">
              로그인
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}