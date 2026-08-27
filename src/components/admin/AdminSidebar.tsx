'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin/orders', label: '주문 관리', icon: '📦' },
  { href: '/admin/dashboard', label: '대시보드', icon: '📊' },
  { href: '/admin/users', label: '사용자 관리', icon: '👥' },
  { href: '/admin/settings', label: '설정', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-clay/20 flex flex-col min-h-screen">
      <div className="p-6 border-b border-clay/20">
        <Link href="/admin/orders" className="font-display text-xl font-bold text-charcoal">
          🏛️ 관리자
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-charcoal text-white'
                  : 'text-slate hover:bg-clay/10 hover:text-charcoal'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              
              {/* 수정된 부분: 여기서 조건에 따라 글자색을 분기합니다. */}
              <span className={`text-sm font-medium ${isActive ? 'text-red-500' : 'text-inherit'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-clay/20 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate hover:text-charcoal transition"
        >
          ← 메인 사이트로
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-slate hover:text-charcoal transition"
        >
          📋 내 주문으로
        </Link>
      </div>
    </aside>
  );
}