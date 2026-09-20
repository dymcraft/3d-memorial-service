import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 🔥 인증이 필요 없는 공개 경로는 조기에 리턴 (성능 최적화)
  const publicPaths = [
    '/',
    '/login',
    '/pricing',
    '/faq',
    '/contact',
    '/products',
  ]

  // 🔥 다운스트림 서버 컴포넌트(app/layout.tsx)가 현재 경로를 알 수 있도록
  // 요청 헤더에 pathname을 실어 보냄. Header.tsx가 서버 컴포넌트라 usePathname()을
  // 못 쓰기 때문에, 이 방식으로 "지금 /admin 경로인지"를 레이아웃에 전달한다.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // 정적 파일도 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // 공개 경로는 인증 체크 없이 바로 통과
  const isPublicPath = publicPaths.some((p) => 
    pathname === p || pathname.startsWith('/products/')
  )

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 🔥 공개 경로는 세션 갱신도 생략 (속도 향상)
  if (!isPublicPath) {
    await supabase.auth.getUser()
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}