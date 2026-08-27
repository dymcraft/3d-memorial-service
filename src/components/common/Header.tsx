'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // 사용자 role 확인
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      }
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="border-b border-clay/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="font-display text-xl font-bold text-charcoal">
            🏛️ 메모리얼 스튜디오
          </Link>

          {/* 메뉴 */}
          <nav className="flex items-center gap-6">
            <Link href="/#products" className="text-sm text-slate hover:text-charcoal transition">
              상품
            </Link>

            {!loading && user && (
              <>
                <Link href="/dashboard" className="text-sm text-slate hover:text-charcoal transition">
                  내 주문
                </Link>

                {/* 🔥 관리자만 보이는 메뉴 */}
                {isAdmin && (
                  <Link
                    href="/admin/orders"
                    className="text-sm text-accentWarm font-medium hover:text-accentWarmHover transition"
                  >
                    ⚙️ 관리자
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-sm text-slate hover:text-charcoal transition"
                >
                  로그아웃
                </button>
              </>
            )}

            {!loading && !user && (
              <Link href="/login" className="text-sm text-accentWarm hover:text-accentWarmHover transition">
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}