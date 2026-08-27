import { createClient } from '@/lib/supabase/server'
import { STEPS } from '@/lib/utils/constants'
import DashboardClient from './DashboardClient'

// 서버 컴포넌트: 초기 데이터만 로드
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { start?: string; end?: string }
}) {
  const supabase = await createClient()

  // URL에서 기간 파라미터 가져오기 (기본값: 최근 30일)
  const endDate = searchParams.end ? new Date(searchParams.end) : new Date()
  const startDate = searchParams.start 
    ? new Date(searchParams.start) 
    : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

  // 날짜를 ISO 문자열로 변환 (쿼리용)
  const startISO = startDate.toISOString().split('T')[0]
  const endISO = endDate.toISOString().split('T')[0]

  // ============ 1. 기간별 기본 통계 ============
  const { count: periodOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startISO)
    .lte('created_at', endISO + 'T23:59:59')

  const { data: periodRevenueData } = await supabase
    .from('orders')
    .select('amount')
    .gte('created_at', startISO)
    .lte('created_at', endISO + 'T23:59:59')
  
  const periodRevenue = periodRevenueData?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0

  // ============ 2. 기간별 일별 매출 ============
  const { data: dailyOrders } = await supabase
    .from('orders')
    .select('created_at, amount')
    .gte('created_at', startISO)
    .lte('created_at', endISO + 'T23:59:59')
    .order('created_at', { ascending: true })

  const dailyRevenue: Record<string, number> = {}
  const dailyCount: Record<string, number> = {}
  dailyOrders?.forEach((order) => {
    const date = new Date(order.created_at).toLocaleDateString('ko-KR')
    dailyRevenue[date] = (dailyRevenue[date] || 0) + (order.amount || 0)
    dailyCount[date] = (dailyCount[date] || 0) + 1
  })

  // ============ 3. 기간별 주문 상태 통계 ============
  const { data: periodAllOrders } = await supabase
    .from('orders')
    .select('current_step, amount')
    .gte('created_at', startISO)
    .lte('created_at', endISO + 'T23:59:59')

  const stepCounts: Record<string, number> = {}
  periodAllOrders?.forEach((order) => {
    stepCounts[order.current_step] = (stepCounts[order.current_step] || 0) + 1
  })

  // ============ 4. 기간별 최근 주문 ============
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, users(email)')
    .gte('created_at', startISO)
    .lte('created_at', endISO + 'T23:59:59')
    .order('created_at', { ascending: false })
    .limit(10)

  // ============ 5. 기간별 추가 통계 ============
  const totalOrders = periodAllOrders?.length || 0
  const totalRevenue = periodRevenue

  // 진행중, 완료 주문 수
  const processingOrders = periodAllOrders?.filter(o => 
    !['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(o.current_step)
  ).length || 0

  const completedOrders = periodAllOrders?.filter(o => 
    ['SHIPPED', 'DELIVERED'].includes(o.current_step)
  ).length || 0

  // ============ 6. 클라이언트에 전달할 데이터 ============
  const dashboardData = {
    startISO,
    endISO,
    totalOrders,
    totalRevenue,
    periodRevenue,
    dailyRevenue,
    dailyCount,
    stepCounts,
    recentOrders,
    processingOrders,
    completedOrders,
    periodOrders: periodOrders || 0,
  }

  return <DashboardClient initialData={dashboardData} />
}