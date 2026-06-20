"use client";

import { Suspense, useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import { signUpUser } from "@/app/actions/authActions";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect query param - lets protected pages send users here and then back
  // to the page they originally wanted after login.
  const redirectTo = searchParams.get("redirect") || "/";

  // useActionState - connects the signup form to the Server Action.
  const [signupState, signupAction] = useActionState(signUpUser, null);

  // Local state to store NextAuth login errors (like "Invalid email or password").
  const [loginError, setLoginError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Controlled inputs - keep typed values in React state.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    setLoginError(""); // Clear login errors when toggling modes
  };

  // Determine which error to show based on the current mode
  const currentError = isSignup ? signupState?.error : loginError;
  const successMessage = isSignup ? signupState?.message : null;

  const handleSuccessOk = () => {
    if (isSignup) {
      setIsSignup(false);
      return;
    }
    router.push(redirectTo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setLoginError(""); // Clear any previous errors

    if (isSignup) {
      // 1. SIGNUP: Trigger the signup Server Action manually
      const data = new FormData(e.target);
      signupAction(data);
    } else {
      // 2. LOGIN: Trigger NextAuth's client-side signIn
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // Prevents NextAuth from doing a full-page reload
      });

      if (res?.error) {
        // If login failed, show a friendly message
        setLoginError("Invalid email or password");
      } else {
        // If login succeeded, redirect the user
        router.push(redirectTo);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-md lg:grid lg:grid-cols-2">
        {/* ── Left panel ── */}
        <section className="relative hidden overflow-hidden bg-orange-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight">
                FoodRush
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-snug">
              {isSignup
                ? "Join the tastiest\ncommunity around."
                : "Your next great\nmeal starts here."}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-orange-100">
              {isSignup
                ? "Create an account and unlock access to hundreds of restaurants, real-time order tracking, and deals made just for you."
                : "Log back in and pick up right where you left off — your cart, your favourites, your orders, all in one place."}
            </p>

            <ul className="mt-8 space-y-3">
              {[
                { icon: "🍽️", text: "200+ restaurants across your city" },
                { icon: "⚡", text: "Average delivery in under 35 mins" },
                { icon: "🎁", text: "Exclusive offers every week" },
              ].map(({ icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm text-orange-100"
                >
                  <span className="text-base">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-10 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-white">
              &quot;Ordered for the whole office and everything arrived hot, on
              time, and perfectly packed. FoodRush has become our go-to.&quot;
            </p>
            <p className="mt-3 text-xs font-semibold text-orange-200">
              — Darshan N, Software Developer · Pune
            </p>
          </div>
        </section>

        {/* ── Right panel ── */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12">
          <p className="mb-6 text-center text-xl font-extrabold text-orange-600 lg:hidden">
            FoodRush
          </p>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignup ? "Create account" : "Welcome back"}
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              {isSignup
                ? "Fill in the details below to get started."
                : "Enter your credentials to continue."}
            </p>
          </div>

          {/* Render error if it exists */}
          {currentError && (
            <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
              {currentError}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  name="name"
                  placeholder="Darshan Nichite"
                  value={formData.name}
                  onChange={handleChange}
                />
                <ErrorMessage message={errors.name} />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="darshan@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <ErrorMessage message={errors.email} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
              <ErrorMessage message={errors.password} />
            </div>

            {isSignup && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <ErrorMessage message={errors.confirmPassword} />
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-orange-600"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-medium text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full">
              {isSignup ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "New to FoodRush?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              {isSignup ? "Login" : "Create an account"}
            </button>
          </p>
        </section>
      </div>

      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">
              {successMessage}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your account is ready. Please log in now.
            </p>
            <Button
              type="button"
              variant="primary"
              className="mt-5 w-full"
              onClick={handleSuccessOk}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
