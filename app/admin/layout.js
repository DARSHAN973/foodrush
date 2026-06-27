// Client Component boundary — needed because this layout uses usePathname(),
// which reads browser navigation state and cannot run in a Server Component.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Store, Flame } from "lucide-react";

// Nested admin layout — gives every /admin route the same dashboard shell.
export default function AdminLayout({ children }) {
  // Active route state — see components/Navbar.js.
  const pathname = usePathname();

  // Bypass layout for the public login screen so guests don't see dashboard headers
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Derived class helper — keeps active/inactive nav styling in one place
  // instead of repeating logic for each Link.
  function navLinkClass(href) {
    const isActive = pathname === href;

    return `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
    }`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-100 bg-white p-6 lg:block">
        <Link href="/" className="flex items-center gap-2 group focus:outline-none select-none">
          <div className="bg-amber-400 text-orange-600 p-1.5 rounded-xl shadow-inner group-hover:scale-105 transition-all">
            <Flame size={20} className="fill-orange-600" />
          </div>
          <span className="text-xl font-black italic tracking-tighter text-orange-600">
            Food<span className="text-amber-500">Rush</span>
          </span>
        </Link>
        <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">Admin Console</p>

        <nav className="mt-8 flex flex-col gap-2">
          <Link href="/admin" className={navLinkClass("/admin")}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link href="/admin/orders" className={navLinkClass("/admin/orders")}>
            <Receipt size={18} />
            <span>Orders</span>
          </Link>

          <Link
            href="/admin/restaurants"
            className={navLinkClass("/admin/restaurants")}
          >
            <Store size={18} />
            <span>Restaurants</span>
          </Link>
        </nav>
      </aside>

      <div className="lg:pl-64">
        {/* Sticky Mobile Header / Desktop Topbar */}
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between lg:justify-start">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight sm:text-lg">
              Admin Dashboard
            </h2>
            
            {/* Branding badge in header on mobile */}
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-1.5 focus:outline-none select-none">
                <div className="bg-amber-400 text-orange-600 p-1 rounded-lg">
                  <Flame size={14} className="fill-orange-600" />
                </div>
                <span className="text-sm font-black italic tracking-tighter text-orange-600">
                  Food<span className="text-amber-500">Rush</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile sub-navigation tabs */}
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden no-scrollbar">
            <Link href="/admin" className={navLinkClass("/admin")}>
              <LayoutDashboard size={16} />
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>

            <Link
              href="/admin/orders"
              className={navLinkClass("/admin/orders")}
            >
              <Receipt size={16} />
              <span className="whitespace-nowrap">Orders</span>
            </Link>

            <Link
              href="/admin/restaurants"
              className={navLinkClass("/admin/restaurants")}
            >
              <Store size={16} />
              <span className="whitespace-nowrap">Restaurants</span>
            </Link>
          </nav>
        </header>

        <main className="px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
