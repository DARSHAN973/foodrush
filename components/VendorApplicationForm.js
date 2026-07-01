"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVendorApplication } from "@/app/actions/vendorActions";
import { ChevronRight, Loader2 } from "lucide-react";

// VendorApplicationForm — client component because it manages form state
// (loading, error). The actual data write happens in the createVendorApplication
// server action. On success, router.refresh() re-runs the server component
// so the profile page re-fetches and shows the PENDING state automatically.
export default function VendorApplicationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const result = await createVendorApplication(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Trigger server component re-fetch — profile page will now see
    // ownedRestaurant.status === "PENDING" and render the pending UI.
    router.refresh();
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-6">
      {/* Restaurant Name */}
      <div>
        <label
          htmlFor="vendor-name"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Restaurant Name <span className="text-red-500">*</span>
        </label>
        <input
          id="vendor-name"
          name="name"
          type="text"
          required
          placeholder="e.g. Spice Garden"
          className={inputClass}
        />
      </div>

      {/* Cuisine Type */}
      <div>
        <label
          htmlFor="vendor-cuisine"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Cuisine Type <span className="text-red-500">*</span>
        </label>
        <input
          id="vendor-cuisine"
          name="cuisine"
          type="text"
          required
          placeholder="e.g. North Indian, Chinese, Italian"
          className={inputClass}
        />
      </div>

      {/* Restaurant Address */}
      <div>
        <label
          htmlFor="vendor-address"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Restaurant Address <span className="text-red-500">*</span>
        </label>
        <input
          id="vendor-address"
          name="address"
          type="text"
          required
          placeholder="Full address including city and pincode"
          className={inputClass}
        />
      </div>

      {/* Contact Phone — optional */}
      <div>
        <label
          htmlFor="vendor-phone"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          Contact Phone{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="vendor-phone"
          name="phone"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          className={inputClass}
        />
      </div>

      {/* Description — optional */}
      <div>
        <label
          htmlFor="vendor-description"
          className="block text-sm font-semibold text-gray-700 mb-1.5"
        >
          About Your Restaurant{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="vendor-description"
          name="description"
          rows={3}
          placeholder="What makes your restaurant special? Briefly describe your food and experience."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        id="vendor-apply-submit"
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Application
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
