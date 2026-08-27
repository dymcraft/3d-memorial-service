import { createClient } from '@/lib/supabase/server';
import OrderTableClient from './OrderTableClient';

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  // 모든 주문 조회 (관리자 권한)
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      users (email, name),
      products (name)
    `)
    .order('created_at', { ascending: false });

  return <OrderTableClient initialOrders={orders || []} />;
}