"use client";

// SessionProvider is a named export, so it must be destructured with curly braces
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  // We must return the JSX so React knows what to render
  return <SessionProvider>{children}</SessionProvider>;
}
