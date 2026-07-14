"use client";

// Client Component — needs useTransition to show loading state while the
// Server Action (updateOrderStatus) is running without blocking the UI.
// useTransition returns [isPending, startTransition]:
//   - isPending: true while the server action is in flight
//   - startTransition: wraps the action call to mark it as non-urgent

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/vendorActions";
import { MapPin, Phone, ChefHat, Clock } from "lucide-react";

// StatusBadge — see app/vendor/page.js for full explanation.
function StatusBadge({ status }) {
  const config = {
    PLACED: {
      cls: "bg-blue-50 text-blue-700 border-blue-200/60",
      dot: "bg-blue-500",
      label: "Placed",
    },
    CONFIRMED: {
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      dot: "bg-indigo-500",
      label: "Confirmed",
    },
    PREPARING: {
      cls: "bg-amber-50 text-amber-700 border-amber-200/60",
      dot: "bg-amber-400",
      label: "Preparing",
    },
    OUT_FOR_DELIVERY: {
      cls: "bg-purple-50 text-purple-700 border-purple-200/60",
      dot: "bg-purple-500",
      label: "Out for Delivery",
    },
    DELIVERED: {
      cls: "bg-green-50 text-green-700 border-green-200/60",
      dot: "bg-green-500",
      label: "Delivered",
    },
    CANCELLED: {
      cls: "bg-red-50 text-red-700 border-red-200/60",
      dot: "bg-red-500",
      label: "Cancelled",
    },
  };

  const item = config[status] || {
    cls: "bg-gray-50 text-gray-700 border-gray-200/60",
    dot: "bg-gray-400",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold uppercase ${item.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
      {item.label}
    </span>
  );
}

// nextStatus / nextLabel — defines the linear vendor order flow.
// Vendor can only move an order FORWARD, never backward.
// DELIVERED and CANCELLED are terminal — no further action possible.
function getNextStatus(current) {
  const flow = {
    PLACED: "CONFIRMED",
    CONFIRMED: "PREPARING",
    PREPARING: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
  };
  return flow[current] || null;
}

function getNextLabel(current) {
  const labels = {
    PLACED: "Confirm Order",
    CONFIRMED: "Start Preparing",
    PREPARING: "Mark Out for Delivery",
    OUT_FOR_DELIVERY: "Mark Delivered",
  };
  return labels[current] || null;
}

// OrderCard — renders one RestaurantOrder with full item details,
// customer delivery info, and the status advance button.
// Gets its own useTransition so each card has independent loading state —
// clicking "Confirm" on order #5 doesn't disable the button on order #7.
function OrderCard({ order }) {
  // useTransition — tracks whether THIS card's server action is in flight.
  // isPending becomes true from the moment startTransition is called until
  // revalidatePath finishes and the page re-renders with fresh data.
  const [isPending, startTransition] = useTransition();

  const nextStatus = getNextStatus(order.status);
  const nextLabel = getNextLabel(order.status);

  function handleAdvance() {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, nextStatus);
      if (result?.error) {
        alert(result.error);
      }
    });
  }

  const isTerminal =
    order.status === "DELIVERED" || order.status === "CANCELLED";

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition ${
        isTerminal ? "border-gray-100 opacity-70" : "border-orange-100"
      }`}
    >
      {/* Order header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b ${
          isTerminal
            ? "bg-gray-50 border-gray-100"
            : "bg-orange-50/60 border-orange-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono font-black text-gray-900 text-sm">
            #{order.id}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={12} />
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })}{" "}
          {new Date(order.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Items list — shows itemName × quantity and price per line */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
            <ChefHat size={12} />
            Items to Prepare
          </p>
          <div className="space-y-1.5 rounded-xl bg-gray-50 px-4 py-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700 font-medium">
                  {item.itemName}
                  <span className="ml-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-full px-2 py-0.5">
                    ×{item.quantity}
                  </span>
                </span>
                <span className="text-gray-500 text-xs">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer delivery info — from parentOrder */}
        {order.parentOrder && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Deliver To
            </p>
            <div className="space-y-1.5">
              {order.parentOrder.deliveryAddress && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin
                    size={14}
                    className="text-orange-500 mt-0.5 shrink-0"
                  />
                  <span>{order.parentOrder.deliveryAddress}</span>
                </div>
              )}
              {order.parentOrder.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-orange-500 shrink-0" />
                  <span>{order.parentOrder.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer: subtotal + action button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/40 px-5 py-3">
        <div>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
            Subtotal
          </p>
          <p className="text-base font-black text-gray-900">
            ₹{order.subtotal.toLocaleString("en-IN")}
          </p>
        </div>

        {nextStatus && nextLabel ? (
          <button
            onClick={handleAdvance}
            disabled={isPending}
            className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-600/20"
          >
            {isPending ? "Updating..." : nextLabel}
          </button>
        ) : (
          <span
            className={`text-xs font-semibold ${
              order.status === "DELIVERED" ? "text-green-600" : "text-red-500"
            }`}
          >
            {order.status === "DELIVERED" ? "✓ Order Complete" : "✗ Cancelled"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VendorOrdersClient({ orders }) {
  // Separate active orders from terminal ones — show active first so vendors
  // see what needs action immediately without scrolling past completed orders.
  const active = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED",
  );
  const done = orders.filter(
    (o) => o.status === "DELIVERED" || o.status === "CANCELLED",
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Manage and update the status of your incoming orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-400 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active orders — need action */}
          {active.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Active ({active.length})
              </p>
              {active.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {/* Completed / Cancelled — for reference */}
          {done.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Completed &amp; Cancelled ({done.length})
              </p>
              {done.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
