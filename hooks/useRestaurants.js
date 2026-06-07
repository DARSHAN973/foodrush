"use client";

import { useEffect, useState } from "react";

// Custom hook — extracts reusable restaurant-fetching state logic
// so components can use restaurants, loading, and error without duplicating fetch code.
// CSR fetch reference — useful for React practice and browser-only flows.
// In Next.js page routes, prefer server fetching when data is needed for initial render.
function useRestaurants() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  // CSR data fetching — this fetch runs in the browser after hydration,
  // so the component needs loading and error state while data is being requested.
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/restaurants");

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();

        setRestaurants(data);
      } catch {
        setError("Failed to fetch restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);
  return { restaurants, loading, error };
}

export default useRestaurants;
