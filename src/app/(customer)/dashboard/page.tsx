import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 관리자 권한 확인 (관리자 버튼 표시용)
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.role === 'admin'

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-ink">마이페이지</h1>
        {/* 🔥 관리자만 보이는 버튼 */}
        {isAdmin && (
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-bronze text-white text-sm rounded-lg hover:bg-bronze-deep transition-colors"
          >
            ⚙️ 관리자 페이지
          </Link>
        )}
      </div>
      <p className="text-sm text-ink-soft mb-10">
        {user.email ?? user.user_metadata?.nickname ?? '회원'}님, 환영합니다.
      </p>

      <h2 className="font-display text-lg font-bold text-ink mb-4">주문내역</h2>

      {orders && orders.length > 0 ? (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="border border-line p-4 flex items-center justify-between hover:border-bronze/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-ink">{order.order_number}</p>
                <p className="text-xs text-ink-soft mt-1">{order.current_step}</p>
              </div>
              <p className="text-sm text-ink">{order.amount?.toLocaleString()}원</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          아직 주문 내역이 없습니다.
        </div>
      )}
    </div>
  )
}