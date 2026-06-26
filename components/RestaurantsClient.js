"use client";

import { useMemo, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import {
  Search,
  SlidersHorizontal,
  Truck,
  ShieldCheck,
  UtensilsCrossed,
  Smartphone,
} from "lucide-react";

export default function RestaurantsClient({ restaurants }) {
  // UI state — stores the user's current search, cuisine filter, and sort choice.
  // These values control how the restaurant list is derived below.
  const [searchText, setSearchText] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  // useMemo — caches the filtered/sorted list until one of its real inputs changes.
  // It is for calculated values, not for storing user-editable state.
  // useMemo for derived options — recalculates cuisine choices only when restaurants change.
  const cuisines = useMemo(() => {
    // Derived filter options — builds the cuisine dropdown from restaurant data.
    // Set removes duplicate cuisines, and "All" lets the user clear the cuisine filter.
    return [
      "All",
      ...new Set(restaurants.map((restaurant) => restaurant.cuisine)),
    ];
  }, [restaurants]);
  // Derived restaurant list — combines search, cuisine filter, and sorting.
  // We calculate this from existing data instead of storing another state value.
  // Avoiding extra state prevents stale or duplicated data bugs.
  const displayRestaurants = useMemo(() => {
    // Normalized search text — trim removes extra spaces and lowercase makes search case-insensitive.
    const searchQuery = searchText.trim().toLowerCase();

    // filter — creates a new array with only restaurants that match the search text and selected cuisine.
    // The original restaurants array stays unchanged.
    const filteredRestaurants = restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery);
      // Cuisine match — "All" means no cuisine filter; otherwise cuisine must match exactly.
      const matchesCuisine =
        selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
      // A restaurant must pass both filters to stay visible.
      return matchesSearch && matchesCuisine;
    });
    // Copy before sort — sort() mutates arrays, so we sort a copied array.
    // This keeps the filtered result safe and avoids accidental data mutation.
    return [...filteredRestaurants].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "time") {
        return a.deliveryTime - b.deliveryTime;
      }

      return 0;
    });
  }, [restaurants, searchText, selectedCuisine, sortBy]);

  // Visible limit — shows only the first 24 matching restaurants to keep the grid manageable.
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

        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100 md:grid md:grid-cols-3 md:gap-4 md:p-4">
          {/* Search Bar (Full width on mobile) */}
          <div className="relative w-full">
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

          {/* Select filters (Side-by-side on mobile, individual grid items on desktop) */}
          <div className="grid grid-cols-2 gap-2 md:contents">
            {/* Cuisine Select */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                <SlidersHorizontal size={14} />
              </span>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 pl-8 pr-8 py-2.5 text-xs sm:text-sm text-gray-700 bg-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
              >
                {cuisines.map((cuisine) => (
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

            {/* Sort Select */}
            <div className="relative w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {displayRestaurants.length === 0 ? (
            <EmptyState
              title="No restaurants found"
              message="Try changing your search or filters."
            />
          ) : (
            // List rendering with map — converts each restaurant object into a RestaurantCard.
            // This keeps the UI driven by data instead of hardcoding cards manually.
            visibleRestaurants.map((restaurant) => (
              // key — gives React a stable identity for each list item,
              // so updates stay correct when restaurants are added, removed, or reordered.
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
