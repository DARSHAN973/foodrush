import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserOrders } from "@/lib/orders";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import {
  User as UserIcon,
  FileText,
  MapPin,
  Calendar,
  Shield,
  Mail,
  ChevronRight,
  ShoppingBag,
  Heart,
  Tag,
  Settings,
  CreditCard,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import VendorApplicationForm from "@/components/VendorApplicationForm";

export const metadata = {
  title: "My Account",
  description:
    "Manage your profile, saved addresses, and view your order history.",
};

// StatusBadge — maps DB enum to readable label + colored dot pill.
// Copied from app/(user)/orders/page.js for self-contained UI consistency.
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

export default async function ProfilePage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Await searchParams as required in Next.js 16
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "profile";

  // Fetch full user record from DB to get role and createdAt details
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const totalOrders = await prisma.parentOrder.count({
    where: { userId: session.user.id },
  });

  const spentAgg = await prisma.parentOrder.aggregate({
    where: {
      userId: session.user.id,
      status: {
        notIn: ["CANCELLED", "PAYMENT_PENDING"],
      },
    },
    _sum: {
      total: true,
    },
  });
  const totalSpent = Number(spentAgg._sum.total || 0);

  // ONLY fetch orders from database if we are on the orders tab
  let orders = null;
  if (activeTab === "orders") {
    orders = await getUserOrders(session.user.id);
  }

  // ONLY fetch vendor restaurant if we are on the vendor tab.
  // ownedRestaurant drives the 4-state UI: none / PENDING / ACTIVE / REJECTED.
  let ownedRestaurant = null;
  if (activeTab === "vendor") {
    ownedRestaurant = await prisma.restaurant.findUnique({
      where: { ownerId: dbUser.id },
    });
  }

  const avatarLetter = (
    dbUser.name?.[0] ||
    dbUser.email?.[0] ||
    "U"
  ).toUpperCase();

  // Tab Styling Helper
  const getTabClass = (tabName) => {
    const base =
      "flex items-center gap-2.5 px-4 py-2.5 md:py-3 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap md:w-full text-center md:text-left justify-center md:justify-start";
    if (activeTab === tabName) {
      return `${base} bg-orange-600 text-white shadow-md shadow-orange-600/10 border border-orange-500/20`;
    }
    return `${base} text-gray-600 hover:bg-orange-50 hover:text-orange-600 bg-white border border-gray-200 md:bg-transparent md:border-none`;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Page Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile, preferences, and track your orders.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Left Column: Side Navigation Tabs */}
          <aside className="flex flex-row overflow-x-auto gap-2 pb-3 scrollbar-none w-full md:sticky md:top-24 md:self-start md:bg-white md:rounded-2xl md:border md:border-gray-200 md:p-4 md:shadow-sm md:flex-col md:pb-0">
            <Link href="/profile" className={getTabClass("profile")}>
              <UserIcon size={18} />
              Personal Info
            </Link>
            <Link href="/profile?tab=orders" className={getTabClass("orders")}>
              <FileText size={18} />
              My Orders
            </Link>
            <Link
              href="/profile?tab=addresses"
              className={getTabClass("addresses")}
            >
              <MapPin size={18} />
              Saved Addresses
            </Link>
            <Link
              href="/profile?tab=favorites"
              className={getTabClass("favorites")}
            >
              <Heart size={18} />
              Favorites
            </Link>
            <Link href="/profile?tab=offers" className={getTabClass("offers")}>
              <Tag size={18} />
              Active Offers
            </Link>
            <Link
              href="/profile?tab=settings"
              className={getTabClass("settings")}
            >
              <Settings size={18} />
              Settings
            </Link>
            <Link href="/profile?tab=vendor" className={getTabClass("vendor")}>
              <Store size={18} />
              Vendor Panel
            </Link>

            {/* Logout button at bottom of sidebar on desktop */}
            <div className="mt-4 border-t border-gray-200 pt-4 hidden md:block">
              <LogoutButton className="w-full !justify-start !px-4" />
            </div>
          </aside>

          {/* Right Column: Tab Content Panel */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm min-h-[400px]">
            {/* --- TAB PANEL: PERSONAL PROFILE INFO --- */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Your basic account credentials and metadata.
                  </p>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Orders Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-orange-600 text-white rounded-xl shadow-sm">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-455 uppercase tracking-wider">
                        Total Orders
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-0.5">
                        {totalOrders}
                      </p>
                    </div>
                  </div>

                  {/* Total Spent Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-orange-600 text-white rounded-xl shadow-sm">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-455 uppercase tracking-wider">
                        Total Spent
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-0.5">
                        ₹{totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Saved Addresses Card */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50 rounded-2xl p-4 flex items-center gap-4">
                    <div className="p-3 bg-orange-600 text-white rounded-xl shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-455 uppercase tracking-wider">
                        Addresses
                      </p>
                      <p className="text-2xl font-black text-gray-900 mt-0.5">
                        0
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Card Header */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-orange-50/50 border border-orange-100 rounded-2xl p-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-2xl font-black text-white shadow-md">
                    {avatarLetter}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900">
                      {dbUser.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800 mt-1">
                      <Shield size={12} />
                      {dbUser.role} Account
                    </span>
                  </div>
                </div>

                {/* Profile Fields List */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-150 p-4">
                    <div className="flex items-center gap-2.5 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Mail size={14} />
                      Email Address
                    </div>
                    <p className="font-semibold text-gray-800">
                      {dbUser.email}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-150 p-4">
                    <div className="flex items-center gap-2.5 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Calendar size={14} />
                      Member Since
                    </div>
                    <p className="font-semibold text-gray-800">
                      {new Date(dbUser.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Mobile logout action helper */}
                <div className="mt-8 border-t border-gray-200 pt-6 md:hidden">
                  <LogoutButton className="w-full bg-red-50 hover:bg-red-100" />
                </div>
              </div>
            )}

            {/* --- TAB PANEL: MY ORDERS --- */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Order History
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Track your active checkouts or view past order details.
                  </p>
                </div>

                {!orders ? (
                  <div className="text-center py-16">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                      🛍️
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      No orders yet
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                      Looks like you haven&apos;t placed any orders. Go browse
                      our restaurants to place one!
                    </p>
                    <Link
                      href="/restaurants"
                      className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-orange-700 transition"
                    >
                      Browse Restaurants
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                      >
                        {/* Header Details */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Order Placed
                              </p>
                              <p className="mt-0.5 text-xs sm:text-sm font-bold text-gray-800">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                            <div className="h-8 w-px bg-gray-200" />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Order ID
                              </p>
                              <p className="mt-0.5 text-xs sm:text-sm font-bold text-gray-800">
                                #{order.id}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>

                        {/* Restaurant Orders */}
                        <div className="divide-y divide-gray-100">
                          {order.restaurantOrders.map((ro) => (
                            <div key={ro.id} className="px-5 py-4">
                              <div className="mb-3 flex items-center justify-between">
                                <span className="font-bold text-sm text-gray-900">
                                  {ro.restaurant.name}
                                </span>
                                <StatusBadge status={ro.status} />
                              </div>

                              <div className="space-y-1.5 rounded-xl bg-gray-50/70 px-4 py-3">
                                {ro.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between text-xs sm:text-sm"
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

                        {/* Order Total breakdown */}
                        <div className="border-t border-gray-100 bg-gray-50/20 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex gap-4 text-[11px] font-semibold text-gray-400">
                            <span>Delivery: ₹{order.deliveryFee}</span>
                            <span>Platform: ₹{order.platformFee}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500">
                              Paid:
                            </span>
                            <span className="text-base font-extrabold text-orange-600">
                              ₹{order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- TAB PANEL: SAVED ADDRESSES --- */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Manage your shipping destinations for faster checkouts.
                    </p>
                  </div>
                </div>

                {/* Elegant Placeholder for future feature */}
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600 text-3xl">
                    📍
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No saved addresses
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                    You can save multiple delivery addresses here (home, work,
                    etc.) to select them with one click during payment.
                  </p>
                  <button
                    disabled
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gray-300 px-5 py-2.5 text-sm font-bold text-gray-500 cursor-not-allowed shadow-none"
                  >
                    Add Address (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: FAVORITES (COMING SOON) --- */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    My Favorites
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Quickly order from your most-loved food spots.
                  </p>
                </div>
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 text-3xl">
                    ❤️
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No favorites yet
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                    Your favorite restaurants will appear here. Click the heart
                    icon on any restaurant card to add it!
                  </p>
                  <button
                    disabled
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gray-300 px-5 py-2.5 text-sm font-bold text-gray-500 cursor-not-allowed shadow-none"
                  >
                    Explore Restaurants (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: ACTIVE OFFERS (COMING SOON) --- */}
            {activeTab === "offers" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Active Offers & Promos
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    View discounts, vouchers, and reward coupons active on your
                    account.
                  </p>
                </div>
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 text-3xl">
                    🎟️
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No active promo codes
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                    Promotional codes and reward coupons will appear here when
                    active on your account.
                  </p>
                  <button
                    disabled
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gray-300 px-5 py-2.5 text-sm font-bold text-gray-500 cursor-not-allowed shadow-none"
                  >
                    View Promo Terms (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: ACCOUNT SETTINGS (COMING SOON) --- */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Account Settings
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your notification settings, privacy preferences, and
                    password.
                  </p>
                </div>
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 text-3xl">
                    ⚙️
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Settings panel locked
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                    Customize your preferences, set dark mode, and manage
                    security options.
                  </p>
                  <button
                    disabled
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gray-300 px-5 py-2.5 text-sm font-bold text-gray-500 cursor-not-allowed shadow-none"
                  >
                    Save Settings (Coming Soon)
                  </button>
                </div>
              </div>
            )}

            {/* --- TAB PANEL: VENDOR PANEL --- */}
            {activeTab === "vendor" && (
              <div className="space-y-6">
                <div className="border-b border-gray-150 pb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Vendor Panel
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    List your restaurant on FoodRush and manage it from one
                    place.
                  </p>
                </div>

                {/* State 1 — No application yet: show CTA + form */}
                {!ownedRestaurant && (
                  <div>
                    {/* Hero CTA */}
                    <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      <div className="p-4 bg-orange-600 text-white rounded-2xl shadow-md shadow-orange-600/20 shrink-0">
                        <Store size={28} />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-gray-900">
                          Become a Vendor on FoodRush
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 max-w-lg">
                          List your restaurant, manage your menu, track orders,
                          and grow your business — all from one vendor
                          dashboard. Apply below and our team will review your
                          application within 24–48 hours.
                        </p>
                      </div>
                    </div>
                    {/* Application Form */}
                    <div className="mt-6 border border-gray-100 rounded-2xl p-6 bg-gray-50/30">
                      <h4 className="text-base font-bold text-gray-800 mb-1">
                        Restaurant Application
                      </h4>
                      <p className="text-sm text-gray-500">
                        Fill in your restaurant details. Our admin team will
                        review and activate your account.
                      </p>
                      <VendorApplicationForm />
                    </div>
                  </div>
                )}

                {/* State 2 — Application is PENDING review */}
                {ownedRestaurant?.status === "PENDING" && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 flex items-start gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0 mt-0.5">
                      <Clock size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-amber-900">
                        Application Under Review
                      </h3>
                      <p className="text-sm text-amber-800 mt-1">
                        We&apos;ve received your application for{" "}
                        <span className="font-bold">
                          {ownedRestaurant.name}
                        </span>
                        . Our team is currently reviewing it. This usually takes{" "}
                        <span className="font-bold">24–48 hours</span>.
                        We&apos;ll update your account status once a decision is
                        made.
                      </p>
                      <p className="text-xs text-amber-600 mt-3 font-semibold">
                        Cuisine: {ownedRestaurant.cuisine} ·{" "}
                        {ownedRestaurant.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* State 3 — Approved: show vendor dashboard link */}
                {ownedRestaurant?.status === "ACTIVE" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-6 flex items-start gap-4">
                      <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0 mt-0.5">
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-green-900">
                          Your Vendor Account is Active!
                        </h3>
                        <p className="text-sm text-green-800 mt-1">
                          <span className="font-bold">
                            {ownedRestaurant.name}
                          </span>{" "}
                          is live on FoodRush. Head to your vendor dashboard to
                          manage your menu, track incoming orders, and view your
                          earnings.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/vendor"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 transition"
                    >
                      Go to Vendor Dashboard
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                )}

                {/* State 4 — Application REJECTED */}
                {ownedRestaurant?.status === "REJECTED" && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
                    <div className="p-3 bg-red-100 text-red-500 rounded-xl shrink-0 mt-0.5">
                      <XCircle size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-red-900">
                        Application Not Approved
                      </h3>
                      <p className="text-sm text-red-800 mt-1">
                        Unfortunately, your application for{" "}
                        <span className="font-bold">
                          {ownedRestaurant.name}
                        </span>{" "}
                        was not approved.
                      </p>
                      {ownedRestaurant.rejectionReason && (
                        <div className="mt-3 rounded-xl bg-white border border-red-100 px-4 py-3">
                          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">
                            Reason from Admin
                          </p>
                          <p className="text-sm text-gray-700">
                            {ownedRestaurant.rejectionReason}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-red-600 mt-3">
                        If you believe this is a mistake, please contact
                        support.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
