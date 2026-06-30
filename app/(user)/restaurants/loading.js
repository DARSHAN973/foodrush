import { Truck, ShieldCheck, UtensilsCrossed } from "lucide-react";

// Reusable card skeleton mimicking mobile/desktop RestaurantCard design
function CardSkeleton() {
  return (
    <>
      {/* Mobile Card Skeleton (hidden on larger screens) */}
      <div className="flex sm:hidden h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
        <div className="relative aspect-video w-full bg-gray-200" />
        <div className="p-3 space-y-3">
          <div className="h-3.5 w-3/4 rounded-md bg-gray-200" />
          <div className="flex justify-between border-t border-gray-50 pt-2">
            <div className="h-3 w-8 rounded-md bg-gray-200" />
            <div className="h-3 w-8 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Desktop Card Skeleton (hidden on mobile) */}
      <div className="hidden sm:flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
        <div className="relative mb-4 h-80 w-full rounded-md bg-gray-200" />
        <div className="flex flex-1 flex-col items-center space-y-3">
          <div className="h-5 w-3/4 rounded-md bg-gray-200" />
          <div className="h-3.5 w-1/4 rounded-full bg-gray-200" />
          <div className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-md bg-gray-50 p-3 space-y-1">
              <div className="h-3 w-8 mx-auto rounded-md bg-gray-200" />
              <div className="h-4 w-12 mx-auto rounded-md bg-gray-200" />
            </div>
            <div className="rounded-md bg-gray-50 p-3 space-y-1">
              <div className="h-3 w-8 mx-auto rounded-md bg-gray-200" />
              <div className="h-4 w-12 mx-auto rounded-md bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="h-9 w-24 rounded-md bg-gray-200" />
          <div className="h-9 w-24 rounded-md bg-gray-200" />
        </div>
      </div>
    </>
  );
}

export default function RestaurantsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto">
        {/* Static Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurants near you
          </h1>
          <p className="mt-1 text-gray-600">
            Search, filter, and order your favorite food.
          </p>
        </div>

        {/* Filters Panel Skeleton - Clean responsive shape placeholders */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4 lg:p-4 items-center">
          {/* Search bar placeholder */}
          <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse sm:col-span-2 lg:col-span-4" />
          {/* Cuisine select placeholder */}
          <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse lg:col-span-2" />
          {/* Rating filter placeholder */}
          <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse lg:col-span-2" />
          {/* Sort select placeholder */}
          <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse lg:col-span-2" />
          {/* Toggle switch placeholder */}
          <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse lg:col-span-2" />
        </div>

        {/* Grid of Card Skeletons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <CardSkeleton key={index} />
            ))}
        </div>

        {/* Value Proposition / Features Section (Static HTML, rendered instantly) */}
        <section className="mt-16 border-t border-gray-200/60 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
              Why order from FoodRush?
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              We ensure your food delivery experience is lightning-fast,
              hygienic, and completely hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 mb-4">
                <Truck size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Super Fast Delivery
              </h3>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Our delivery partner network ensures your food arrives hot,
                fresh, and on time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Hygiene Standards
              </h3>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                From restaurant kitchen to your doorstep, safety and sanitation
                are our top priority.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 mb-4">
                <UtensilsCrossed size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Endless Cuisines
              </h3>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Discover local delights and international favorites all in one
                single checkout.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
