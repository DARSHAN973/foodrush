"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession, signOut } from "next-auth/react";
import Button from "./Button";
import Input from "./Input";

export function AdminLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      const session = await getSession();
      if (session?.user?.role !== "ADMIN") {
        setError("Access denied: Admin role required");
        await signOut({ redirect: false }); // Logout so they don't hold a user session here
      } else {
        router.push("/admin"); // Success redirect
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-gray-100">
        {/* Secure Portal Shield Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure Administration
          </span>
        </div>

        {/* Header Section */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">
            FoodRush
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 font-medium">
            Control Panel Access
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Admin Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="admin@foodrush.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Overriding primary styling to use the admin blue theme */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Verifying access..." : "Access Control Panel"}
          </Button>
        </form>
      </div>
    </main>
  );
}
