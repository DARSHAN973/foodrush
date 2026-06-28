"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import RestaurantCard from "@/components/RestaurantCard";
import EmptyState from "@/components/EmptyState";
import {
  Search,
  SlidersHorizontal,
  Truck,
  ShieldCheck,
  UtensilsCrossed,
  Star,
} from "lucide-react";

export default function RestaurantsClient({ restaurants, cuisines = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current filter state from URL query parameters
  const selectedCuisine = searchParams.get("cuisine") || "All";
  const sortBy = searchParams.get("sortBy") || "default";
  const selectedRating = searchParams.get("rating") || "";
  const isOpenOnly = searchParams.get("isOpen") === "true";

  // Local state for smooth, non-laggy search input typing
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || "",
  );

  // Debouncing — updates URL only after user stops typing for 300ms.
  // This prevents spamming the database with a query on every keypress.
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchText.trim()) {
        params.set("search", searchText.trim());
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText, router, pathname, searchParams]);

  // Instant filter update for dropdowns and checkboxes
  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (
      value &&
      value !== "All" &&
      value !== "default" &&
      value !== "false" &&
      value !== ""
    ) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const cuisineOptions = ["All", ...cuisines];
  const displayRestaurants = restaurants;
  const visibleRestaurants = displayRestaurants.slice(0, 24);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurants near you
          </h1>

          <p className="mt-1 text-gray-600">
            Search, filter, and order your favorite food.
          </p>
        </div>

        {/* Filters Panel - Styled with 12 column grid on desktop, wrapping gracefully */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4 lg:p-4 items-center">
          {/* Search Bar */}
          <div className="relative w-full sm:col-span-2 lg:col-span-4">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder-gray-400 transition-all"
            />
          </div>

          {/* Cuisine Select */}
          <div className="relative w-full lg:col-span-2">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <SlidersHorizontal size={14} />
            </span>
            <select
              value={selectedCuisine}
              onChange={(e) => handleFilterChange("cuisine", e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 pl-8 pr-8 py-2.5 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
            >
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="relative w-full lg:col-span-2">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Star size={14} className="fill-gray-400 text-gray-400" />
            </span>
            <select
              value={selectedRating}
              onChange={(e) => handleFilterChange("rating", e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 pl-8 pr-8 py-2.5 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
            >
              <option value="">All Ratings</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Sort Select */}
          <div className="relative w-full lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 pl-4 pr-8 py-2.5 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="time">Sort: Delivery Time</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Open/Closed Toggle */}
          <div className="flex items-center justify-start sm:justify-center lg:col-span-2 lg:justify-end pl-1 sm:pl-0">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isOpenOnly}
                onChange={(e) =>
                  handleFilterChange(
                    "isOpen",
                    e.target.checked ? "true" : "false",
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700">
                Open Only
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {displayRestaurants.length === 0 ? (
            <EmptyState
              title="No restaurants found"
              message="Try changing your search or filters."
            />
          ) : (
            visibleRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          )}
        </div>

        {/* --- VALUE PROPOSITION / FEATURES SECTION --- */}
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
