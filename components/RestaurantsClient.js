"use client";

import { useMemo, useState } from "react";
import RestaurantCard from "@/components/RestaurantCard";
import EmptyState from "@/components/EmptyState";

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
        return a.cookTimeMinutes - b.cookTimeMinutes;
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

        <div className="mb-8 grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-3">
          {/*
            Controlled input pattern — value displays React state, onChange updates it.
            See components/Input.js
          */}
          <input
            type="text"
            placeholder="Search Restaurants..."
            value={searchText}
            // Event handler — pass a function so React can call it later when the user types.
            // e.target.value is the current text from the input.
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
          {/*
             Controlled select — React state decides the selected option,
             and onChange updates that state when the user chooses a cuisine.
          */}
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="default">Default</option>
            <option value="rating">Rating: High to Low</option>
            <option value="time">Delivery Time: Low to High</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      </div>
    </main>
  );
}
