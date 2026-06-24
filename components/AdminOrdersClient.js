"use client";

import { useState, useTransition } from "react";
import { updateRestaurantOrderStatusAction } from "@/app/actions/adminOrderActions";

// Status styling mapping for Parent Invoice statuses
const parentStatusConfig = {
  PAYMENT_PENDING: {
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    label: "Pending Payment",
  },
  PLACED: {
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    label: "Placed",
  },
  PARTIALLY_COMPLETED: {
    cls: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    label: "Partially Delivered",
  },
  COMPLETED: {
    cls: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    label: "Completed",
  },
  CANCELLED: {
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    label: "Cancelled",
  },
};

// Sub-order status options for the select dropdown
const allowedSubStatuses = [
  { value: "PLACED", label: "Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminOrdersClient({ orders = [] }) {
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);
  const [activeSelectId, setActiveSelectId] = useState(null); // tracks which select is currently writing to the database

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (restaurantOrderId, newStatus) => {
    setActiveSelectId(restaurantOrderId);
    startTransition(async () => {
      const result = await updateRestaurantOrderStatusAction(
        restaurantOrderId,
        newStatus,
      );
      setActiveSelectId(null);
      if (result?.error) {
        showToast(result.error, "error");
      } else {
        showToast(result?.message || "Status updated successfully", "success");
      }
    });
  };

  // Helper count logic for badge pills
  const activeCount = orders.filter(
    (o) => o.status === "PLACED" || o.status === "PARTIALLY_COMPLETED",
  ).length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  // Filter list based on selected tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ACTIVE") {
      return (
        order.status === "PLACED" || order.status === "PARTIALLY_COMPLETED"
      );
    }
    if (activeTab === "COMPLETED") {
      return order.status === "COMPLETED";
    }
    if (activeTab === "CANCELLED") {
      return order.status === "CANCELLED";
    }
    return true; // "ALL"
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 ${
            toast.type === "error" ? "bg-red-600" : "bg-gray-900"
          }`}
        >
          {toast.type === "error" ? "⚠️" : "✨"} {toast.message}
        </div>
      )}

      {/* Header and Counters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Orders Queue
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming, active, and past restaurant shipments.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "ACTIVE"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Active Orders
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === "ACTIVE"
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "COMPLETED"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Completed
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === "COMPLETED"
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CANCELLED")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "CANCELLED"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Cancelled
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === "CANCELLED"
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {cancelledCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "ALL"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          All Checkouts
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
            {orders.length}
          </span>
        </button>
      </div>

      {/* Orders Cards Queue */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-xl">
            📦
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no checkouts in the "{activeTab.toLowerCase()}" queue.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => {
            const config = parentStatusConfig[order.status] || {
              cls: "bg-gray-50 text-gray-700 border-gray-200",
              dot: "bg-gray-400",
              label: order.status,
            };

            const orderDate = new Date(order.createdAt).toLocaleString(
              "en-IN",
              {
                dateStyle: "medium",
                timeStyle: "short",
              },
            );

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition duration-200"
              >
                {/* Card Header (Checkout Details) */}
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                        ORDER #{order.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${config.cls}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{orderDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">
                      Grand Total
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 grid gap-6 md:grid-cols-3">
                  {/* Customer Information Block */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-3 md:col-span-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Delivery Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.user?.name || "Anonymous User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email}
                        </p>
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <p className="text-xs font-medium text-gray-400">
                          Address
                        </p>
                        <p className="text-gray-600 leading-snug mt-0.5">
                          {order.deliveryAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Phone
                        </p>
                        <p className="font-mono text-gray-700 mt-0.5">
                          {order.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sub-orders Block */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Restaurant Fulfillment
                    </h3>
                    <div className="grid gap-4">
                      {order.restaurantOrders.map((ro) => (
                        <div
                          key={ro.id}
                          className="flex flex-col justify-between rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center gap-4 bg-white"
                        >
                          {/* Restaurant Info & Items */}
                          <div className="space-y-2">
                            <h4 className="font-bold text-gray-900">
                              {ro.restaurant?.name ||
                                `Restaurant #${ro.restaurantId}`}
                            </h4>
                            <ul className="space-y-1">
                              {ro.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="text-sm text-gray-600 flex items-center gap-2"
                                >
                                  <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600">
                                    {item.quantity}x
                                  </span>
                                  <span>{item.itemName}</span>
                                  <span className="text-xs text-gray-400 font-mono">
                                    (₹{item.price})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Sub-order Status Selector */}
                          <div className="flex items-center gap-3 self-start sm:self-center">
                            {activeSelectId === ro.id && (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                            )}
                            <select
                              value={ro.status}
                              disabled={isPending}
                              onChange={(e) =>
                                handleStatusChange(ro.id, e.target.value)
                              }
                              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50 transition"
                            >
                              {allowedSubStatuses.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
