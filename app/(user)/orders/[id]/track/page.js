import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import OrderTracker from "@/components/OrderTracker";
import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";

// generateMetadata — dynamically sets the page title to include the order ID.
// Runs server-side before the page renders.
export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Tracking Order #${id}`,
    description: `Live status tracking for your FoodRush order #${id}.`,
  };
}

export default async function OrderTrackPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  // Fetch the order — getOrderById validates ownership (userId must match session).
  // If the order doesn't exist or belongs to another user, it returns null.
  const order = await getOrderById(id, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Back navigation */}
        <Link
          href="/profile?tab=orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to My Orders
        </Link>

        {/* Page header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Order #{order.id}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Live tracker card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-6">
            Live Order Status
          </h2>

          {/* OrderTracker is a Client Component.
              We pass initialRestaurants (server-fetched) so it renders immediately
              with correct data — no blank flash while EventSource connects.
              The component then opens an EventSource to keep statuses updated live. */}
          <OrderTracker
            orderId={order.id}
            initialRestaurants={order.restaurantOrders.map((ro) => ({
              id: ro.id,
              name: ro.restaurant.name,
              status: ro.status,
            }))}
          />
        </div>

        {/* Order breakdown — static summary per restaurant */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {order.restaurantOrders.map((ro) => (
              <div key={ro.id} className="px-6 py-4 space-y-3">
                {/* Restaurant name */}
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Store size={15} className="text-orange-600" />
                  {ro.restaurant.name}
                </div>

                {/* Items list */}
                <div className="space-y-1.5 rounded-xl bg-gray-50 px-4 py-3">
                  {ro.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {item.itemName}{" "}
                        <span className="font-bold text-gray-400">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment summary footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Platform Fee</span>
              <span>₹{order.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1.5 border-t border-gray-200">
              <span>Total Paid</span>
              <span className="text-orange-600">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
