"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }) {
  return (
    <button
      onClick={async () => {
        await signOut({ redirect: false });
        window.location.href = "/";
      }}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-red-500 hover:bg-red-50 active:scale-95 transition-all cursor-pointer ${className}`}
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}
