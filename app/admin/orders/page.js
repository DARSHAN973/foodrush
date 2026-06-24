import { unstable_noStore as noStore } from "next/cache";
import { getAdminOrders } from "@/lib/admin";
import AdminOrdersClient from "@/components/AdminOrdersClient";
export default async function AdminOrders() {
  noStore();
  const orders = await getAdminOrders();
  return <AdminOrdersClient orders={orders} />;
}
