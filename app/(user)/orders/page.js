import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserOrders } from "@/lib/orders";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "My Orders | FoodRush",
  description: "View your past orders and track their delivery status.",
};

// StatusBadge — maps DB enum to readable label + colored dot pill.
// Used for both ParentOrder.status and RestaurantOrder.status.
function StatusBadge({ status }) {
  const config = {
    PAYMENT_PENDING: {
      label: "Payment Pending",
      dot: "bg-yellow-400",
      cls: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    PLACED: {
      label: "Order Placed",
      dot: "bg-blue-500",
      cls: "bg-blue-50 border-blue-200 text-blue-700",
    },
    PREPARING: {
      label: "Preparing",
      dot: "bg-orange-500",
      cls: "bg-orange-50 border-orange-200 text-orange-700",
    },
    OUT_FOR_DELIVERY: {
      label: "Out for Delivery",
      dot: "bg-purple-500",
      cls: "bg-purple-50 border-purple-200 text-purple-700",
    },
    DELIVERED: {
      label: "Delivered",
      dot: "bg-green-500",
      cls: "bg-green-50 border-green-200 text-green-700",
    },
    CANCELLED: {
      label: "Cancelled",
      dot: "bg-red-500",
      cls: "bg-red-50 border-red-200 text-red-700",
    },
  };

  const c = config[status] ?? {
    label: status,
    dot: "bg-gray-400",
    cls: "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${c.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const orders = await getUserOrders(session.user.id);

  // Empty state — user has no orders yet
  if (!orders) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
            🛍️
          </div>
          <h1 className="text-2xl font-bold text-gray-900">No orders yet</h1>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t placed any orders. Let&apos;s change
            that!
          </p>
          <Link
            href="/restaurants"
            className="mt-6 inline-block rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            Browse Restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"} · sorted
            by latest
          </p>
        </div>

        {/* Orders list — one card per checkout/payment event (ParentOrder) */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Order header — date, id, overall status */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Order placed
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                      #{order.id}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Restaurant-wise sub-orders inside this checkout */}
              <div className="divide-y divide-gray-100">
                {order.restaurantOrders.map((ro) => (
                  <div key={ro.id} className="px-5 py-5">
                    {/* Restaurant avatar + name + its own status */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                          {ro.restaurant.name[0]}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {ro.restaurant.name}
                        </span>
                      </div>
                      <StatusBadge status={ro.status} />
                    </div>

                    {/* Items — uses snapshot fields (itemName, price).
                        These are stored at order time, so prices are always
                        what the user actually paid, not today's price. */}
                    <div className="space-y-2 rounded-xl bg-gray-50 px-4 py-3">
                      {ro.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2 text-gray-700">
                            <span className="text-gray-400">•</span>
                            {item.itemName}
                            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                              ×{item.quantity}
                            </span>
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 text-right text-xs text-gray-400">
                      Subtotal: ₹{ro.subtotal}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total footer — fee breakdown + grand total */}
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                  <span>Delivery fee: ₹{order.deliveryFee}</span>
                  <span>Platform fee: ₹{order.platformFee}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
                  <span className="text-sm font-medium text-gray-600">
                    Grand Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{order.total}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
