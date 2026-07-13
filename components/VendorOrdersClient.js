"use client";

// Client Component — needs useTransition to show loading state while the
// Server Action (updateOrderStatus) is running without blocking the UI.
// useTransition returns [isPending, startTransition]:
//   - isPending: true while the server action is in flight
//   - startTransition: wraps the action call to mark it as non-urgent

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/vendorActions";

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

// OrderCard — renders one order with its advance button.
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
        // Simple fallback — could be replaced with a Toast in a future session.
        alert(result.error);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
      {/* Order header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono font-black text-gray-900">#{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <span className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })}{" "}
          {new Date(order.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Items list */}
      <div className="mt-3">
        <p className="text-xs text-gray-500">
          {order.items.map((item) => item.itemName).join(" · ")}
        </p>
      </div>

      {/* Footer: Total + Action button */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-4">
        <span className="text-base font-black text-gray-900">
          ₹{order.subtotal.toLocaleString("en-IN")}
        </span>

        {nextStatus && nextLabel ? (
          <button
            onClick={handleAdvance}
            disabled={isPending}
            className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Updating..." : nextLabel}
          </button>
        ) : (
          <span className="text-xs text-gray-400 font-medium">
            {order.status === "DELIVERED" ? "Order complete" : "Order cancelled"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VendorOrdersClient({ orders }) {
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

      {/* Orders list */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
