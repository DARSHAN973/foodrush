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
  User,
} from "lucide-react";

export default function NavbarClient({ cartCount }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // isLoggingOut — set to true the moment logout is clicked.
  // signOut() takes a moment to clear the session cookie and redirect.
  // The overlay keeps the UI blocked so the user doesn't click anything else.
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  // Click outside handler — closes both desktop dropdown and mobile hamburger menu
  // when clicking anywhere else on the page.
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
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
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-orange-600/95 backdrop-blur-md text-white shadow-md border-b border-orange-500/20"
      >
        {/* --- TOP BAR (Logo & Mobile Toggle) --- */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h2>
              <Link
                href="/"
                className="flex items-center gap-2 group focus:outline-none select-none"
              >
                <div className="bg-amber-400 text-orange-600 p-1.5 rounded-xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Flame size={20} className="fill-orange-600 animate-pulse" />
                </div>
                <span className="text-2xl font-black italic tracking-tighter text-white">
                  Food
                  <span className="text-amber-300 group-hover:text-amber-400 transition-colors">
                    Rush
                  </span>
                </span>
              </Link>
            </h2>
          </div>

          {/* Mobile Hamburger Button with CSS animations */}
          <button
            className="sm:hidden text-white hover:text-orange-200 focus:outline-none transition-all p-2.5 -mr-2.5 active:scale-90 rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              {/* Top Bar */}
              <span
                className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                }`}
              />
              {/* Middle Bar */}
              <span
                className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* Bottom Bar */}
              <span
                className={`absolute block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                }`}
              />
            </div>
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
                setIsLoggingOut={setIsLoggingOut}
              />
            </ul>
          </div>
        </div>

        {/* --- MOBILE MENU DROPDOWN (Obsidian Glassmorphic Card Layout) --- */}
        <div
          className={`absolute top-16 left-4 right-4 sm:hidden bg-orange-950/96 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-4 shadow-2xl shadow-black/30 transition-all duration-300 transform origin-top-right z-50 ${
            isMobileMenuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <ul className="flex flex-col gap-2">
            <NavLinks
              pathname={pathname}
              cartCount={cartCount}
              isMobile={true}
            />

            {/* Divider line before user actions */}
            <div className="mt-1.5 pt-3 border-t border-white/5">
              <UserMenu
                session={session}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                avatarLetter={avatarLetter}
                dropdownRef={dropdownRef}
                isMobile={true}
                setIsLoggingOut={setIsLoggingOut}
              />
            </div>
          </ul>
        </div>
      </nav>

      {/* Full-screen logout overlay — placed outside the sticky <nav> wrapper so
          that CSS containing blocks (like backdrop-blur-md) on the <nav> do not
          constrain this fixed overlay from occupying the full viewport height/width. */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            <p className="text-sm font-bold text-gray-700">
              Signing you out...
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// -------------------------------------------------------------
// HELPER COMPONENTS
// -------------------------------------------------------------

function NavLinks({ pathname, cartCount, isMobile }) {
  // Common link styling depending on if it's mobile or desktop
  const baseClasses = `flex items-center gap-2 font-bold transition-all duration-200 ${
    isMobile
      ? "px-4 py-3 text-base w-full rounded-xl active:scale-[0.98]"
      : "px-3 py-2 text-sm sm:text-base rounded-lg hover:scale-105 active:scale-95"
  }`;

  const getActiveClasses = (path) => {
    if (pathname === path) {
      return isMobile
        ? "bg-orange-600 text-white shadow-md shadow-orange-600/10 border border-orange-500/20"
        : "bg-white text-orange-600 shadow-sm";
    }
    return isMobile
      ? "text-orange-100/80 hover:bg-white/5 hover:text-white"
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
              className={`absolute flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white shadow-sm border border-orange-500/20
              ${isMobile ? "right-4 top-3.5" : "bg-gray-900 -right-1 -top-2"}`}
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
  setIsLoggingOut,
}) {
  if (!session) {
    return (
      <li>
        <Link
          href="/login"
          className={`flex items-center gap-2 font-bold transition-all bg-orange-600 text-white hover:bg-orange-750 active:scale-95 ${
            isMobile
              ? "px-4 py-3 text-base w-full justify-center mt-2 rounded-xl shadow-lg shadow-orange-950/10 border border-orange-500/10"
              : "px-4 py-2 text-sm sm:text-base rounded-md"
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 font-extrabold border-2 border-orange-500/50 shadow-inner">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-white truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-orange-200/80 truncate mt-0.5">
              {session.user.email}
            </p>
          </div>
        </div>
        <li>
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            <User size={20} />
            My Profile
          </Link>
        </li>
        <li>
          <button
            onClick={async () => {
              setIsLoggingOut(true);
              await signOut({ redirect: false });
              window.location.href = "/";
            }}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-red-300 hover:bg-red-500/10 active:scale-[0.98] transition-all"
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
              href="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <User size={16} />
              My Profile
            </Link>
          </div>
          <div className="py-1">
            <button
              onClick={async () => {
                setIsDropdownOpen(false);
                setIsLoggingOut(true);
                await signOut({ redirect: false });
                window.location.href = "/";
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
