import { ArrowLeft, Shield, Store } from "lucide-react";

export default function CartLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back Link Button Skeleton */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-400 shadow-sm animate-pulse">
          <ArrowLeft size={14} />
          Back to Restaurants
        </div>

        {/* Header Title Skeleton */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Your Cart
            </h1>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-32 rounded-xl border border-gray-200 bg-gray-100 animate-pulse hidden sm:block" />
        </div>

        {/* Layout Grid */}
        <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
          {/* Left Side: Cart Items Skeletons */}
          <div className="space-y-6">
            {/* We render a skeleton cart group for 1 restaurant */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm space-y-4 animate-pulse">
              {/* Restaurant Header Skeleton */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2 rounded-xl text-gray-400">
                    <Store size={16} />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-250 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-20 bg-gray-100 rounded-lg" />
              </div>

              {/* Items List Skeletons */}
              <div className="divide-y divide-gray-50">
                {Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0 items-center"
                    >
                      {/* Thumbnail Placeholder */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-200 flex-shrink-0" />

                      {/* Details Placeholder */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-250 rounded" />
                        <div className="h-3 w-1/4 bg-gray-200 rounded" />
                      </div>

                      {/* Controls Placeholder */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
                        <div className="w-24 h-8 bg-gray-100 rounded-lg" />
                        <div className="space-y-1 text-right min-w-[70px]">
                          <div className="h-2 w-10 bg-gray-200 rounded ml-auto" />
                          <div className="h-4.5 w-16 bg-gray-250 rounded ml-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary Box Skeleton */}
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:sticky md:top-24 animate-pulse space-y-4">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-6 bg-gray-200 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <div className="h-4 w-12 bg-gray-250 rounded" />
                <div className="h-4 w-16 bg-gray-250 rounded" />
              </div>
            </div>

            {/* Proceed button placeholder */}
            <div className="w-full h-11 bg-gray-250 rounded-xl" />

            {/* Secure badge placeholder */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <Shield size={12} />
              <span>Secure Checkout powered by Razorpay</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
