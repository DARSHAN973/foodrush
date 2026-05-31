"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";

function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newError = {};

    if (isSignup && formData.name.trim() === "") {
      newError.name = "Name is required";
    }

    if (formData.email.trim() === "") {
      newError.email = "Email is required";
    }

    if (isSignup && formData.phone.trim() === "") {
      newError.phone = "Phone number is required";
    } else if (isSignup && formData.phone.length < 10) {
      newError.phone = "Phone number must be at least 10 digits";
    }

    if (formData.password.trim() === "") {
      newError.password = "Password is required";
    } else if (formData.password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }

    if (isSignup && formData.confirmPassword.trim() === "") {
      newError.confirmPassword = "Confirm password is required";
    } else if (isSignup && formData.confirmPassword !== formData.password) {
      newError.confirmPassword = "Passwords do not match";
    }

    setErrors(newError);

    if (Object.keys(newError).length === 0) {
      console.log(isSignup ? "signup successful" : "login successful", formData);
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-2">
        <section className="hidden bg-orange-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-100">
              Welcome back
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Order faster with your FoodRush account.
            </h1>

            <p className="mt-4 text-orange-100">
              Save your cart, manage orders, and get back to your favorite
              meals.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-5">
            <p className="text-sm text-orange-100">
              Demo login for learning. Real authentication will come with
              backend.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignup
                ? "Create your FoodRush account."
                : "Continue to your FoodRush account."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <ErrorMessage message={errors.phone} />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <ErrorMessage message={errors.password} />
            </div>

            {isSignup && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <ErrorMessage message={errors.confirmPassword} />
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" />
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

          <p className="mt-6 text-center text-sm text-gray-600">
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
    </main>
  );
}

export default Login;
