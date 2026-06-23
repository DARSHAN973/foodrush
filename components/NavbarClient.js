"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function NavbarClient({ cartCount }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const avatarLetter = (
    session?.user?.name?.[0] ||
    session?.user?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 flex flex-col gap-3 bg-orange-600 px-4 py-4 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h2 className="text-2xl font-bold">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            FoodRush
          </Link>
        </h2>
      </div>
      <div>
        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <li>
            {/* Next Link — navigates between App Router pages without a full browser reload. */}
            <Link
              href="/"
              className={`rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                pathname === "/"
                  ? "bg-white text-orange-600"
                  : "text-white hover:bg-orange-700"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/restaurants"
              className={`rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                pathname === "/restaurants"
                  ? "bg-white text-orange-600"
                  : "text-white hover:bg-orange-700"
              }`}
            >
              Restaurants
            </Link>
          </li>

          {/* NextAuth Session Check — displays a profile avatar with dropdown
              when logged in and a Login link when logged out. */}
          {session ? (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600 font-extrabold border-2 border-orange-500 hover:bg-orange-50 transition-colors shadow-sm focus:outline-none cursor-pointer"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {avatarLetter}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 z-50 py-2 divide-y divide-gray-100">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      My Orders
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-650 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className={`rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                  pathname === "/login"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-orange-700"
                }`}
              >
                Login
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/cart"
              className={`relative rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                pathname === "/cart"
                  ? "bg-white text-orange-600"
                  : "text-white hover:bg-orange-700"
              }`}
            >
              Cart
              {/* Conditional badge — show cart count only when there are items,
                  so the navbar stays clean when the cart is empty. */}
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-xs font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
