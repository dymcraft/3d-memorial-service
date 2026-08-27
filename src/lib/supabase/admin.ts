import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ⚠️ 이 파일은 절대 브라우저(컴포넌트)에서 import 하면 안 됩니다.
// API 라우트(route.ts) 안에서만 사용하세요.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
}