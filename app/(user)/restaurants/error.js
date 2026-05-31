"use client";

import ErrorMessage from "@/components/ErrorMessage";

export default function RestaurantsError({ error, reset }) {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <ErrorMessage message="Failed to load restaurants. Please try again." />

        <button
          onClick={reset}
          className="mt-4 rounded-md bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}