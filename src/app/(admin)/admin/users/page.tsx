import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // 1. 모든 사용자 조회
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. 각 사용자의 주문 통계를 별도로 조회
  const usersWithStats = await Promise.all(
    (users || []).map(async (user) => {
      // 해당 사용자의 모든 주문 조회
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)

      const totalOrders = orders?.length || 0
      const totalAmount = orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0
      
      // 최근 주문일
      const latestOrder = orders?.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]

      // 주문 상태별 카운트
      const statusCounts: Record<string, number> = {}
      orders?.forEach((o) => {
        statusCounts[o.current_step] = (statusCounts[o.current_step] || 0) + 1
      })

      return {
        ...user,
        totalOrders,
        totalAmount,
        latestOrderDate: latestOrder?.created_at || null,
        statusCounts,
        // 완료된 주문 수 (SHIPPED, DELIVERED)
        completedOrders: orders?.filter(o => 
          ['SHIPPED', 'DELIVERED'].includes(o.current_step)
        ).length || 0,
        // 진행중인 주문 수
        processingOrders: orders?.filter(o => 
          !['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(o.current_step)
        ).length || 0,
      }
    })
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-medium text-charcoal">👥 회원 관리</h2>
        <span className="text-sm text-slate">총 {usersWithStats.length}명</span>
      </div>

      <div className="bg-white rounded-2xl border border-clay/20 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-clay/20">
                <th className="text-left px-4 py-3 font-medium text-slate">회원명</th>
                <th className="text-left px-4 py-3 font-medium text-slate">이메일</th>
                <th className="text-left px-4 py-3 font-medium text-slate">가입일</th>
                <th className="text-center px-4 py-3 font-medium text-slate">주문횟수</th>
                <th className="text-right px-4 py-3 font-medium text-slate">총 주문금액</th>
                <th className="text-center px-4 py-3 font-medium text-slate">진행중</th>
                <th className="text-center px-4 py-3 font-medium text-slate">완료</th>
                <th className="text-center px-4 py-3 font-medium text-slate">최근 주문일</th>
              </tr>
            </thead>
            <tbody>
              {usersWithStats.map((user) => (
                <tr key={user.id} className="border-b border-clay/10 hover:bg-cream/30 transition">
                  <td className="px-4 py-3 font-medium text-charcoal">
                    {user.name || '이름 없음'}
                  </td>
                  <td className="px-4 py-3 text-slate font-mono text-xs">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-slate text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-charcoal">
                    {user.totalOrders}회
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">
                    {user.totalAmount.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.processingOrders > 0 ? (
                      <span className="text-accentWarm font-medium">{user.processingOrders}</span>
                    ) : (
                      <span className="text-mist">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.completedOrders > 0 ? (
                      <span className="text-sage font-medium">{user.completedOrders}</span>
                    ) : (
                      <span className="text-mist">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate text-xs text-center">
                    {user.latestOrderDate ? new Date(user.latestOrderDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {usersWithStats.length === 0 && (
        <div className="text-center py-12 text-slate">
          <p>등록된 회원이 없습니다.</p>
        </div>
      )}
    </div>
  )
}