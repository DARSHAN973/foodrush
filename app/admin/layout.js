// Client Component boundary — needed because this layout uses usePathname(),
// which reads browser navigation state and cannot run in a Server Component.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

    return `rounded-md px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-orange-600 text-white"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
    }`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white p-6 lg:block">
        <h1 className="text-2xl font-bold text-orange-600">FoodRush</h1>
        <p className="mt-1 text-sm text-gray-500">Admin Panel</p>

        <nav className="mt-8 flex flex-col gap-2">
          <Link href="/admin" className={navLinkClass("/admin")}>
            Dashboard
          </Link>

          <Link href="/admin/orders" className={navLinkClass("/admin/orders")}>
            Orders
          </Link>

          <Link
            href="/admin/restaurants"
            className={navLinkClass("/admin/restaurants")}
          >
            Restaurants
          </Link>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Admin Dashboard
          </h2>

          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            <Link href="/admin" className={navLinkClass("/admin")}>
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className={navLinkClass("/admin/orders")}
            >
              Orders
            </Link>

            <Link
              href="/admin/restaurants"
              className={navLinkClass("/admin/restaurants")}
            >
              Restaurants
            </Link>
          </nav>
        </header>

        <main className="px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
