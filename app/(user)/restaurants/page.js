"use client";

import useRestaurants from "@/hooks/useRestaurants";
import RestaurantCard from "@/components/RestaurantCard";
import { useMemo, useState } from "react";
import Loading from "@/components/Loading";
import EmptyState from "@/components/EmptyState";


function Restaurants() {

  const { restaurants, loading, error } = useRestaurants();

  const [searchText, setSearchText] = useState("");

  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const [sortBy, setSortBy] = useState("default");

  const displayRestaurants = useMemo(() => {
    const searchQuery = searchText.trim().toLowerCase();

    const filteredRestaurants = restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery);

      const matchesCuisine =
        selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;

      return matchesSearch && matchesCuisine;
    });

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

  const visibleRestaurants = displayRestaurants.slice(0, 24);

  const cuisines = useMemo(() => {
    return [
      "All",
      ...new Set(restaurants.map((restaurant) => restaurant.cuisine)),
    ];
  }, [restaurants]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurants near you
          </h1>
          <p className="mt-1 text-gray-600">
            Search , filter, and order your favorite food.
          </p>
        </div>
        <div className="mb-8 grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-3">
          <input
            type="text"
            placeholder="Search Restaurants..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
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

        {loading ? (
          <Loading message="Loading Restaurants..." />
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayRestaurants.length === 0 ? (
              <EmptyState
                title="No restaurants found"
                message="Try changing your search or filters."
              />
            ) : (
              visibleRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Restaurants;
