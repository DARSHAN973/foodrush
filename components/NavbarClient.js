"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Home,
  Store,
  ShoppingCart,
  LogIn,
  FileText,
  LogOut,
  Flame,
} from "lucide-react";

export default function NavbarClient({ cartCount }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close both menus when the URL (pathname) changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const avatarLetter = (
    session?.user?.name?.[0] ||
    session?.user?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-orange-600/95 backdrop-blur-md text-white shadow-md border-b border-orange-500/20">
      {/* --- TOP BAR (Logo & Mobile Toggle) --- */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h2>
            <Link href="/" className="flex items-center gap-2 group focus:outline-none select-none">
              <div className="bg-amber-400 text-orange-600 p-1.5 rounded-xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Flame size={20} className="fill-orange-600 animate-pulse" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-white">
                Food<span className="text-amber-300 group-hover:text-amber-400 transition-colors">Rush</span>
              </span>
            </Link>
          </h2>
        </div>

        {/* Mobile Hamburger Button (Hidden on sm and larger) */}
        <button
          className="sm:hidden text-white hover:text-orange-200 focus:outline-none transition-all p-2 -mr-2 active:bg-orange-700 active:scale-95 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* --- DESKTOP MENU (Hidden on mobile) --- */}
        <div className="hidden sm:block">
          <ul className="flex items-center gap-2 lg:gap-4">
            <NavLinks pathname={pathname} cartCount={cartCount} />
            <UserMenu
              session={session}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              avatarLetter={avatarLetter}
              dropdownRef={dropdownRef}
            />
          </ul>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN (Visible only when toggle is open) --- */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-orange-700 px-4 pt-2 pb-6 shadow-inner">
          <ul className="flex flex-col gap-3">
            <NavLinks
              pathname={pathname}
              cartCount={cartCount}
              isMobile={true}
            />

            {/* Divider line before user actions */}
            <div className="mt-2 pt-4 border-t border-orange-500">
              <UserMenu
                session={session}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                avatarLetter={avatarLetter}
                dropdownRef={dropdownRef}
                isMobile={true}
              />
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}

// -------------------------------------------------------------
// HELPER COMPONENTS
// -------------------------------------------------------------

function NavLinks({ pathname, cartCount, isMobile }) {
  // Common link styling depending on if it's mobile or desktop
  const baseClasses = `flex items-center gap-2 rounded-md font-semibold transition ${
    isMobile ? "px-4 py-3 text-base w-full" : "px-3 py-2 text-sm sm:text-base"
  }`;

  const getActiveClasses = (path) => {
    return pathname === path
      ? "bg-white text-orange-600"
      : "text-white hover:bg-orange-700 hover:text-white";
  };

  return (
    <>
      <li>
        <Link href="/" className={`${baseClasses} ${getActiveClasses("/")}`}>
          <Home size={isMobile ? 20 : 18} />
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/restaurants"
          className={`${baseClasses} ${getActiveClasses("/restaurants")}`}
        >
          <Store size={isMobile ? 20 : 18} />
          Restaurants
        </Link>
      </li>
      <li>
        <Link
          href="/cart"
          className={`relative ${baseClasses} ${getActiveClasses("/cart")}`}
        >
          <ShoppingCart size={isMobile ? 20 : 18} />
          Cart
          {cartCount > 0 && (
            <span
              className={`absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-xs font-bold text-white shadow-sm
              ${isMobile ? "right-4 top-3" : "-right-1 -top-2"}`}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </li>
    </>
  );
}

function UserMenu({
  session,
  isDropdownOpen,
  setIsDropdownOpen,
  avatarLetter,
  dropdownRef,
  isMobile,
}) {
  if (!session) {
    return (
      <li>
        <Link
          href="/login"
          className={`flex items-center gap-2 rounded-md font-semibold transition bg-orange-800 text-white hover:bg-orange-900 ${
            isMobile
              ? "px-4 py-3 text-base w-full justify-center mt-2"
              : "px-4 py-2 text-sm sm:text-base"
          }`}
        >
          <LogIn size={isMobile ? 20 : 18} />
          Login
        </Link>
      </li>
    );
  }

  // --- MOBILE USER MENU ---
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 font-extrabold border-2 border-orange-500">
            {avatarLetter}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{session.user.name}</p>
            <p className="text-xs text-orange-200">{session.user.email}</p>
          </div>
        </div>
        <li>
          <Link
            href="/orders"
            className="flex items-center gap-2 rounded-md px-4 py-3 text-base font-semibold text-white hover:bg-orange-800 transition"
          >
            <FileText size={20} />
            My Orders
          </Link>
        </li>
        <li>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 rounded-md px-4 py-3 text-base font-semibold text-red-200 hover:bg-red-500 hover:text-white transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </li>
      </div>
    );
  }

  // --- DESKTOP USER MENU (Dropdown) ---
  return (
    <li className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-600 font-extrabold border-2 border-orange-500 hover:bg-orange-50 transition-colors shadow-sm focus:outline-none cursor-pointer ml-1"
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
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <FileText size={16} />
              My Orders
            </Link>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
