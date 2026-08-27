'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const errorMsg = searchParams.get('error')
    if (errorMsg) setError(errorMsg)
  }, [searchParams])

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({ email })

    setLoading(false)
    if (error) {
      setError('인증번호 전송에 실패했습니다: ' + error.message)
    } else {
      setStep('code')
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    setLoading(false)
    if (error) {
      setError('인증번호가 올바르지 않습니다: ' + error.message)
    } else {
      // 🔥 로그인 성공 후 사용자 role 확인하여 리디렉션
      if (data?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()
        
        if (profile?.role === 'admin') {
          router.push('/admin/orders')
        } else {
          const redirectTo = searchParams.get('redirect') || '/dashboard'
          router.push(redirectTo)
        }
      } else {
        const redirectTo = searchParams.get('redirect') || '/dashboard'
        router.push(redirectTo)
      }
      router.refresh()
    }
  }

  async function handleKakaoLogin() {
    setError('')
    const redirectParam = searchParams.get('redirect') || '/'
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectParam)}`,
        scopes: 'profile_nickname',
      },
    })
    if (error) {
      setError('카카오 로그인에 실패했습니다: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center mb-6">로그인</h1>

        {step === 'email' && (
          <>
            <button
              onClick={handleKakaoLogin}
              type="button"
              className="w-full bg-[#FEE500] text-black rounded-lg py-2 font-medium"
            >
              카카오로 3초만에 시작하기
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">또는</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSendCode} className="space-y-3">
              <input
                type="email"
                required
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
              >
                {loading ? '전송 중...' : '인증번호 받기'}
              </button>
            </form>
          </>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-3">
            <p className="text-sm text-gray-500 text-center">
              {email} 주소로 6자리 인증번호를 보냈습니다.
            </p>
            <input
              type="text"
              inputMode="numeric"
              required
              placeholder="인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-center text-lg tracking-widest"
              maxLength={10}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-50"
            >
              {loading ? '확인 중...' : '로그인'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-400 py-1"
            >
              다른 이메일로 다시 시도
            </button>
          </form>
        )}
      </div>
    </div>
  )
}