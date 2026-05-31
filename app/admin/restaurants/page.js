"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/Loading";

function AdminRestaurants() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timerId);
  }, []);

  if (loading) {
    return <Loading message="Loading restaurants..." />;
  }
  const restaurants = [
    { name: "Shree Pure Veg", cuisine: "Veg", rating: 4.5 },
    { name: "Chinese Town", cuisine: "Chinese", rating: 4.2 },
    { name: "Farm House Food", cuisine: "Non-Veg", rating: 4.7 },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-1 text-gray-600">Manage restaurant listings.</p>
        </div>

        <button className="rounded-md bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
          Add Restaurant
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.name}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-semibold text-gray-900">{restaurant.name}</h2>
            <p className="mt-2 text-sm text-gray-600">{restaurant.cuisine}</p>
            <p className="mt-3 text-sm font-medium text-orange-600">
              Rating {restaurant.rating}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRestaurants;
