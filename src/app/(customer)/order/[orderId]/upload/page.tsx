import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import PhotoUploadForm from '@/components/order/PhotoUploadForm'

export default async function UploadPage({
  params,
}: {
  params: { orderId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id')
    .eq('id', params.orderId)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-2xl font-bold text-ink mb-8">사진 업로드</h1>
      <PhotoUploadForm orderId={order.id} />
    </div>
  )
}