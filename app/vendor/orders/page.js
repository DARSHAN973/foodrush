import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getVendorRestaurant, getVendorOrders } from "@/lib/vendor";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import VendorOrdersClient from "@/components/VendorOrdersClient";

// Server Component — fetches real orders scoped to the logged-in vendor's restaurant.
// The interactive status buttons live in VendorOrdersClient (Client Component)
// because they call a Server Action and need useTransition for loading state.
export default async function VendorOrdersPage() {
  noStore();

  const session = await getServerSession(authOptions);

  // Get the vendor's restaurant to get restaurantId for the order query.
  const restaurant = await getVendorRestaurant(session.user.id);
  if (!restaurant) redirect("/profile");

  // getVendorOrders — all RestaurantOrders for this restaurant, newest first.
  // Includes items (with menuItem name) and parentOrder (for customer info).
  // Decimal serialization is handled inside getVendorOrders in lib/vendor.js —
  // all Decimal fields (price, subtotal, deliveryFee, etc.) come back as plain numbers.
  const orders = await getVendorOrders(restaurant.id);

  return <VendorOrdersClient orders={orders} />;
}
