import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  ClipboardList,
  Settings,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";

// StatusBadge — maps RestaurantOrderStatus enum values to styled pill badges.
// Same pattern as admin/page.js StatusBadge but scoped to vendor-relevant statuses.
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

// React Server Component — fetches vendor-specific stats and recent orders
// scoped to the logged-in vendor's restaurant.
// noStore() disables caching so every visit shows fresh live data.
export default async function VendorDashboard() {
  noStore();

  // --- Hardcoded placeholder data (will be replaced with real DB calls) ---
  const isOpen = true; // restaurant open/closed state

  const metricCards = [
    {
      label: "Total Orders",
      value: "10",
      subtext: "All orders received by your restaurant",
      accent: "border-orange-500",
    },
    {
      label: "Today's Orders",
      value: "2",
      subtext: "Orders placed at your restaurant today",
      accent: "border-blue-500",
    },
    {
      label: "Total Revenue",
      value: "₹2,600",
      subtext: "Earnings from completed orders",
      accent: "border-emerald-500",
    },
    {
      label: "Active Menu Items",
      value: "6",
      subtext: "Items currently visible to customers",
      accent: "border-amber-500",
    },
    {
      label: "Pending Orders",
      value: "1",
      subtext: "Orders waiting for your action",
      accent: "border-purple-500",
    },
    {
      label: "Unread Warnings",
      value: "1",
      subtext: "Alerts sent by the admin team",
      accent: "border-rose-500",
    },
  ];

  const recentOrders = [
    {
      id: 101,
      customerName: "Rahul Sharma",
      itemCount: 3,
      total: 580,
      status: "PLACED",
      createdAt: new Date("2025-07-07T13:20:00"),
    },
    {
      id: 102,
      customerName: "Priya Patel",
      itemCount: 1,
      total: 220,
      status: "PREPARING",
      createdAt: new Date("2025-07-07T12:45:00"),
    },
    {
      id: 103,
      customerName: "Arjun Mehta",
      itemCount: 2,
      total: 410,
      status: "DELIVERED",
      createdAt: new Date("2025-07-07T11:10:00"),
    },
    {
      id: 98,
      customerName: "Sneha Iyer",
      itemCount: 4,
      total: 890,
      status: "DELIVERED",
      createdAt: new Date("2025-07-06T19:30:00"),
    },
    {
      id: 95,
      customerName: "Karan Joshi",
      itemCount: 2,
      total: 340,
      status: "CANCELLED",
      createdAt: new Date("2025-07-06T18:05:00"),
    },
  ];

  // Hardcoded admin warning (will come from VendorWarning model later)
  const unreadWarnings = [
    { id: 1, message: "Please ensure your menu prices are up to date." },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
          My Dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Overview of your restaurant&apos;s performance.
        </p>
      </div>

      {/* Admin Warnings Banner — only renders if there are unread warnings */}
      {unreadWarnings.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-rose-700">
              {unreadWarnings.length} Admin Warning
              {unreadWarnings.length > 1 ? "s" : ""}
            </p>
            <p className="mt-0.5 text-xs text-rose-600">
              {unreadWarnings[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Grid of Metric Cards: 2-columns on mobile, 3-columns on desktop */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border-l-4 ${card.accent} border-y border-r border-gray-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition duration-200`}
          >
            <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 truncate">
              {card.label}
            </p>
            <h2 className="mt-1.5 text-base sm:text-2xl font-black text-gray-900 truncate">
              {card.value}
            </h2>
            <p className="mt-1 text-[9px] sm:text-xs text-gray-500 truncate">
              {card.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Two-column section: Recent Orders (left) + Sidebar (right) */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left column: Recent Orders table */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-500">
                Showing the latest 5 orders for your restaurant.
              </p>
            </div>
            <Link
              href="/vendor/orders"
              className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              View All Orders
            </Link>
          </div>

          {/* Desktop table — hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4 text-right">Total</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 pr-4 font-mono font-bold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="py-4 pr-4 font-semibold text-gray-800">
                      {order.customerName}
                    </td>
                    <td className="py-4 pr-4 text-gray-500">
                      {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                    </td>
                    <td className="py-4 pr-4 text-right font-extrabold text-gray-900">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile order cards — hidden on desktop */}
          <div className="space-y-3 md:hidden">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-gray-100 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-gray-900">
                    #{order.id}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{order.customerName}</span>
                  <span className="font-bold text-gray-900">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Restaurant Status + Quick Shortcuts */}
        <div className="space-y-6 lg:col-span-1">
          {/* Restaurant Open/Closed status card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Restaurant Status
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Control whether customers can place orders.
            </p>

            <div
              className={`flex items-center justify-between rounded-xl border p-4 ${
                isOpen
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-bold ${
                    isOpen ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {isOpen ? "Open for Orders" : "Currently Closed"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isOpen
                    ? "Customers can order from you"
                    : "No new orders will come in"}
                </p>
              </div>
              <ToggleRight
                size={28}
                className={isOpen ? "text-green-500" : "text-gray-400"}
              />
            </div>

            <p className="mt-3 text-[11px] text-gray-400">
              Live toggle coming soon in Management page.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Quick Shortcuts
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Direct paths to common vendor tasks.
            </p>

            <div className="grid gap-3">
              <Link
                href="/vendor/orders"
                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-xs sm:text-sm font-bold text-gray-700 hover:border-orange-200 hover:bg-orange-50/20 hover:text-orange-600 transition"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList size={16} />
                  View All Orders
                </span>
                <span className="text-base font-light">→</span>
              </Link>

              <Link
                href="/vendor/management"
                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-xs sm:text-sm font-bold text-gray-700 hover:border-orange-200 hover:bg-orange-50/20 hover:text-orange-600 transition"
              >
                <span className="flex items-center gap-2">
                  <Settings size={16} />
                  Manage Menu Items
                </span>
                <span className="text-base font-light">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
