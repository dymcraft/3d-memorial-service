import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductGrid from '@/components/shop/ProductGrid'
import OccasionSection from '@/components/home/OccasionSection'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 🔥 관리자 계정이면 바로 관리자 페이지로 리디렉션
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role === 'admin') {
      redirect('/admin/orders')
    }
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, product_options(*)')
    .eq('is_active', true)
    .order('display_order')

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-bronze/[0.06] via-stone-paper to-stone-paper">
        <svg
          viewBox="0 0 400 400"
          className="absolute -top-20 -right-20 w-[420px] h-[420px] opacity-[0.12] pointer-events-none"
        >
          <circle cx="200" cy="200" r="190" fill="none" stroke="#8B3A3A" strokeWidth="1" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="#8B3A3A" strokeWidth="1" />
          <circle cx="200" cy="200" r="110" fill="none" stroke="#8B3A3A" strokeWidth="1" />
          <circle cx="200" cy="200" r="70" fill="none" stroke="#8B3A3A" strokeWidth="1" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <p className="text-xs tracking-[0.2em] text-seal uppercase mb-4">3D Figure Craft</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink leading-tight max-w-2xl">
            특별한 순간을,{' '}
            <span className="font-accent text-seal text-5xl sm:text-6xl">오래도록</span>
            <br />
            간직하는 조형물
          </h1>
          <p className="text-ink-soft max-w-md mt-6">
            추모, 축하, 커플, 반려동물까지 — 사진 한 장이면 충분합니다.
            정면·측면 사진만 보내주시면 3D 스캔부터 프린팅, 후가공까지 책임지고 제작해드립니다.
          </p>
          <Link
            href="#products"
            className="inline-block mt-8 bg-ink text-stone-paper px-7 py-3 rounded-full text-sm shadow-soft hover:shadow-medium hover:bg-seal transition-all"
          >
            상품 둘러보기
          </Link>
        </div>
      </section>

      <OccasionSection />

      <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-xl font-bold text-ink">상품</h2>
          <div className="flex-1 h-px bg-line" />
          <span className="text-xs text-ink-soft/60">{products?.length ?? 0}개</span>
        </div>
        <ProductGrid products={products ?? []} />
      </section>
    </div>
  )
}
