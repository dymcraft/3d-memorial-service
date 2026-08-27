'use client'

import { useState } from 'react'
import { STEPS } from '@/lib/utils/constants'

export default function AdminSettingsPage() {
  // 임시 설정값 (실제로는 DB에 저장)
  const [estimates, setEstimates] = useState<Record<string, number>>({
    AI_PROCESSING: 2,
    CONFIRM_WAITING: 1,
    APPROVED: 0.5,
    PRINTING_START: 0.5,
    PRINTING_RESIN: 2,
    PRINTING_PLA: 1.5,
    POST_PROCESS: 1.5,
    PACKAGING: 0.5,
    SHIPPED: 1,
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    
    // TODO: 실제 DB에 저장하는 로직 추가
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-medium text-charcoal mb-6">⚙️ 설정</h2>

      <div className="bg-white rounded-2xl p-6 border border-clay/20 shadow-soft">
        <h3 className="font-display text-lg font-medium text-charcoal mb-4">
          공정별 예상 소요 시간 (일)
        </h3>
        <p className="text-sm text-slate mb-6">
          각 공정 단계별 예상 소요 시간을 설정하면 고객에게 표시되는 예상 완료일이 계산됩니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step) => {
            // ORDER_RECEIVED와 DELIVERED는 설정 불필요
            if (step.code === 'ORDER_RECEIVED' || step.code === 'DELIVERED') return null
            
            const value = estimates[step.code] ?? 1
            
            return (
              <div key={step.code} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3">
                <span className="text-xl">{step.emoji}</span>
                <span className="text-xs text-slate flex-1">{step.label}</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={value}
                  onChange={(e) => {
                    setEstimates(prev => ({
                      ...prev,
                      [step.code]: parseFloat(e.target.value) || 0
                    }))
                  }}
                  className="w-16 px-2 py-1 border border-clay/30 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-accentWarm/50"
                />
                <span className="text-xs text-slate">일</span>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-charcoal text-white rounded-xl text-sm hover:bg-charcoal/90 transition disabled:opacity-50"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>
          {saved && (
            <span className="text-sm text-green-600">✅ 저장되었습니다!</span>
          )}
        </div>
      </div>

      <div className="mt-6 bg-cream rounded-2xl p-6 border border-clay/20">
        <h3 className="font-display text-sm font-medium text-charcoal mb-2">📌 안내</h3>
        <ul className="text-xs text-slate space-y-1 list-disc list-inside">
          <li>설정값은 고객의 주문 상세 페이지에 표시되는 예상 완료일 계산에 사용됩니다.</li>
          <li>0.5일 단위로 설정할 수 있습니다 (예: 0.5일 = 12시간).</li>
          <li>각 공정의 실제 소요 시간과 일치하도록 조정해주세요.</li>
        </ul>
      </div>
    </div>
  )
}