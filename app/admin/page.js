import Link from "next/link";
import { getAdminStats, getRecentOrders } from "@/lib/admin";
import { unstable_noStore as noStore } from "next/cache";

// StatusBadge — maps DB ParentOrderStatus enum values directly to styling configurations.
// First time this status mapper appears in an admin context, translating backend
// states into user-friendly badge pills.
function StatusBadge({ status }) {
  const config = {
    PAYMENT_PENDING: {
      cls: "bg-yellow-50 text-yellow-700 border-yellow-200/60",
      dot: "bg-yellow-400",
      label: "Pending Payment",
    },
    PLACED: {
      cls: "bg-blue-50 text-blue-700 border-blue-200/60",
      dot: "bg-blue-500",
      label: "Placed",
    },
    PARTIALLY_COMPLETED: {
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      dot: "bg-indigo-500",
      label: "Partially Ready",
    },
    COMPLETED: {
      cls: "bg-green-50 text-green-700 border-green-200/60",
      dot: "bg-green-500",
      label: "Completed",
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

// React Server Component — fetches stats and recent orders directly from the database at request time.
// This removes the need for client-side useEffect state, API endpoints, and fake timeout skeletons.
export default async function AdminDashboard() {
  noStore();
  const stats = await getAdminStats();
  const recentOrders = await getRecentOrders(10);

  // Financial Metrics: Calculate Average Order Value (AOV).
  // Safeguard against division by zero in case of new/empty platforms.
  const aov =
    stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  // Visual Analytics: Calculate Platform fee and Delivery fee share percentages
  // to power the visual dashboard breakdown progress bars.
  const totalFees = stats.totalPlatformFee + stats.totalDeliveryFee;
  const platformPercentage =
    totalFees > 0 ? (stats.totalPlatformFee / totalFees) * 100 : 0;
  const deliveryPercentage =
    totalFees > 0 ? (stats.totalDeliveryFee / totalFees) * 100 : 0;

  const metricCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      subtext: "From successful checkouts",
      accent: "border-orange-500",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      subtext: "Successful checkouts count",
      accent: "border-blue-500",
    },
    {
      label: "Average Order Value (AOV)",
      value: `₹${aov.toFixed(2)}`,
      subtext: "Avg spend per order",
      accent: "border-emerald-500",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toLocaleString(),
      subtext: "Active restaurant orders queue",
      accent: "border-amber-500",
    },
    {
      label: "Active Partners",
      value: `${stats.totalRestaurants} Rest.`,
      subtext: "Onboarded restaurants",
      accent: "border-purple-500",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers.toLocaleString(),
      subtext: "FoodRush client accounts",
      accent: "border-rose-500",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Platform-wide overview of operations and metrics.
        </p>
      </div>

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

      {/* Two Column Main Section */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Orders (lg:col-span-2) */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Recent Transactions
              </h2>
              <p className="text-xs text-gray-500">
                Showing the latest 10 active checkouts.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="w-fit rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              View All Orders
            </Link>
          </div>

          {/* Desktop View: Full details table (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Date & Time</th>
                  <th className="pb-3 pr-4 text-right">Total Amount</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No transactions have been placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="py-4 pr-4 font-mono font-bold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user.email}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">
                        <div>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-right font-extrabold text-gray-900">
                        ₹{order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: List of Cards (hidden on desktop) */}
          <div className="space-y-4 md:hidden">
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-xs text-gray-500">
                No transactions have been placed yet.
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 space-y-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs sm:text-sm text-gray-900">
                      #{order.id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="text-[11px] sm:text-xs space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">
                        Customer:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {order.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Email:</span>
                      <span className="text-gray-500 truncate max-w-[160px]">
                        {order.user.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Placed:</span>
                      <span className="text-gray-600">
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
                  </div>

                  <div className="border-t border-gray-50 pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Total Amount
                    </span>
                    <span className="font-black text-xs sm:text-sm text-gray-900">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Platform Financials & Quick Actions (lg:col-span-1) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Section: Platform Fee Share */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Platform Revenue
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Split of delivery and platform fee commissions.
            </p>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  <span>Commission Fees (Platform)</span>
                  <span className="font-bold text-gray-900">
                    ₹{stats.totalPlatformFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${platformPercentage}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-gray-400">
                  {platformPercentage.toFixed(1)}% of non-menu revenue
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  <span>Delivery Fees Collected</span>
                  <span className="font-bold text-gray-900">
                    ₹{stats.totalDeliveryFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${deliveryPercentage}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-gray-400">
                  {deliveryPercentage.toFixed(1)}% disbursed to riders
                </p>
              </div>
            </div>
          </div>

          {/* Section: Quick Actions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              Quick Shortcuts
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Direct paths to administrative tasks.
            </p>

            <div className="grid gap-3">
              <Link
                href="/admin/restaurants"
                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-xs sm:text-sm font-bold text-gray-700 hover:border-orange-200 hover:bg-orange-50/20 hover:text-orange-600 transition"
              >
                <span>Manage Restaurants</span>
                <span className="text-base font-light">→</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 text-xs sm:text-sm font-bold text-gray-700 hover:border-orange-200 hover:bg-orange-50/20 hover:text-orange-600 transition"
              >
                <span>Active Orders Queue</span>
                <span className="text-base font-light">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
