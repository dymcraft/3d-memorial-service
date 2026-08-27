'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { STEPS } from '@/lib/utils/constants'

interface DashboardData {
  startISO: string
  endISO: string
  totalOrders: number
  totalRevenue: number
  periodRevenue: number
  dailyRevenue: Record<string, number>
  dailyCount: Record<string, number>
  stepCounts: Record<string, number>
  recentOrders: any[]
  processingOrders: number
  completedOrders: number
  periodOrders: number
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 기간 설정 상태
  const [startDate, setStartDate] = useState(initialData.startISO)
  const [endDate, setEndDate] = useState(initialData.endISO)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(initialData)

  // 기간 적용
  const applyDateRange = () => {
    setIsLoading(true)
    const params = new URLSearchParams()
    if (startDate) params.set('start', startDate)
    if (endDate) params.set('end', endDate)
    router.push(`/admin/dashboard?${params.toString()}`)
    // router.push는 페이지를 새로고침하므로, 로딩 상태는 페이지 전환 후 초기화됨
  }

  // 초기 데이터가 업데이트되면 상태 갱신
  useEffect(() => {
    setData(initialData)
    setIsLoading(false)
  }, [initialData])

  // 프리셋 기간 설정
  const setPreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-2xl font-medium text-charcoal">📊 대시보드</h2>
        
        {/* 기간 선택 영역 */}
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl p-4 border border-clay/20 shadow-soft">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreset(7)}
              className="px-3 py-1 text-xs rounded-full bg-cream hover:bg-clay/20 transition text-slate"
            >
              최근 7일
            </button>
            <button
              onClick={() => setPreset(30)}
              className="px-3 py-1 text-xs rounded-full bg-cream hover:bg-clay/20 transition text-slate"
            >
              최근 30일
            </button>
            <button
              onClick={() => setPreset(90)}
              className="px-3 py-1 text-xs rounded-full bg-cream hover:bg-clay/20 transition text-slate"
            >
              최근 90일
            </button>
          </div>
          
          <div className="w-px h-6 bg-clay/30" />
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-clay/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accentWarm/50"
            />
            <span className="text-xs text-slate">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-clay/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accentWarm/50"
            />
            <button
              onClick={applyDateRange}
              disabled={isLoading}
              className="px-4 py-1.5 bg-charcoal text-white text-sm rounded-lg hover:bg-charcoal/90 transition disabled:opacity-50"
            >
              적용
            </button>
          </div>
        </div>
      </div>

      {/* ===== 상단 통계 카드 ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">📦 주문 건수</p>
          <p className="font-display text-3xl font-bold text-charcoal">{data.totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">💰 총 매출</p>
          <p className="font-display text-3xl font-bold text-charcoal">{data.totalRevenue.toLocaleString()}원</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">🔄 진행중</p>
          <p className="font-display text-3xl font-bold text-accentWarm">{data.processingOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">✅ 완료</p>
          <p className="font-display text-3xl font-bold text-sage">{data.completedOrders}</p>
        </div>
      </div>

      {/* ===== 기간 정보 ===== */}
      <div className="bg-cream rounded-2xl p-4 border border-clay/20 mb-8">
        <p className="text-sm text-slate">
          📅 조회 기간: <span className="font-medium text-charcoal">{data.startISO}</span> ~ <span className="font-medium text-charcoal">{data.endISO}</span>
          &nbsp;· 총 {data.totalOrders}건 주문
        </p>
      </div>

      {/* ===== 일별 매출 차트 ===== */}
      <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft mb-8">
        <h3 className="font-display text-lg font-medium text-charcoal mb-4">📊 일별 매출</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {Object.entries(data.dailyRevenue).length > 0 ? (
            Object.entries(data.dailyRevenue).map(([date, revenue]) => {
              const count = data.dailyCount[date] || 0
              const maxRevenue = Math.max(...Object.values(data.dailyRevenue))
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0
              
              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-slate w-24 flex-shrink-0">{date}</span>
                  <div className="flex-1 h-6 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accentWarm/70 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-charcoal w-20 text-right flex-shrink-0">
                    {revenue.toLocaleString()}원
                  </span>
                  <span className="text-xs text-slate w-12 text-right flex-shrink-0">
                    {count}건
                  </span>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-slate text-center py-4">해당 기간에 주문 데이터가 없습니다.</p>
          )}
        </div>
      </div>

      {/* ===== 단계별 주문 현황 + 최근 주문 ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <h3 className="font-display text-lg font-medium text-charcoal mb-4">📌 단계별 주문 현황</h3>
          <div className="grid grid-cols-2 gap-2">
            {STEPS.map((step) => {
              const count = data.stepCounts[step.code] || 0
              return (
                <div key={step.code} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${count > 0 ? 'bg-cream' : 'bg-cream/50'}`}>
                  <span className="text-lg">{step.emoji}</span>
                  <span className="text-xs text-slate truncate flex-1">{step.label}</span>
                  <span className={`text-sm font-medium ${count > 0 ? 'text-charcoal' : 'text-mist'}`}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <h3 className="font-display text-lg font-medium text-charcoal mb-4">🕐 최근 주문</h3>
          {data.recentOrders && data.recentOrders.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.recentOrders.map((order) => {
                const step = STEPS.find((s) => s.code === order.current_step)
                return (
                  <div key={order.id} className="flex items-center justify-between border-b border-clay/10 py-2">
                    <div>
                      <p className="text-xs font-medium text-charcoal">{order.order_number}</p>
                      <p className="text-xs text-slate">{order.users?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs">{step?.emoji}</span>
                      <span className="text-xs text-charcoal font-medium">{order.amount?.toLocaleString()}원</span>
                      <span className="text-xs text-slate">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate text-center py-4">해당 기간에 최근 주문이 없습니다.</p>
          )}
        </div>
      </div>

      {/* ===== 추가 통계 ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">📦 평균 주문 금액</p>
          <p className="font-display text-2xl font-bold text-charcoal">
            {data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders).toLocaleString() : 0}원
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">📈 일평균 매출</p>
          <p className="font-display text-2xl font-bold text-charcoal">
            {Object.keys(data.dailyRevenue).length > 0 
              ? Math.round(data.totalRevenue / Object.keys(data.dailyRevenue).length).toLocaleString() 
              : 0}원
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
          <p className="text-sm text-slate mb-1">📊 주문 전환율</p>
          <p className="font-display text-2xl font-bold text-charcoal">
            {data.totalOrders > 0 ? ((data.completedOrders / data.totalOrders) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
    </div>
  )
}