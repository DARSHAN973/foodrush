"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { cartCount } = useContext(CartContext);
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 flex flex-col gap-3 bg-orange-600 px-4 py-4 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h2 className="text-2xl font-bold">FoodRush</h2>
      </div>
      <div>
        <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <li>
            <Link
              href="/"
              className={
                `rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                  pathname === "/"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-orange-700"
                }`
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/restaurants"
              className={
                `rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                  pathname === "/restaurants"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-orange-700"
                }`
              }
            >
              Restaurants
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className={
                `rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                  pathname === "/login"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-orange-700"
                }`
              }
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className={
                `relative rounded-md px-3 py-2 text-sm font-semibold transition sm:text-base ${
                  pathname === "/cart"
                    ? "bg-white text-orange-600"
                    : "text-white hover:bg-orange-700"
                }`
              }
            >
              Cart
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

