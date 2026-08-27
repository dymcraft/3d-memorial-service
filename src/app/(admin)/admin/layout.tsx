import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 관리자 권한 확인
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-cream">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-clay/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-medium text-charcoal">
              관리자 대시보드
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate">{user.email}</span>
              <form action="/api/auth/logout" method="POST">
                <button className="text-sm text-slate hover:text-charcoal transition">
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}