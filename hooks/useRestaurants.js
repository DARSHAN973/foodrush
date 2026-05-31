"use client";

import { useEffect, useState } from "react";


function useRestaurants() {
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const response = await fetch("https://dummyjson.com/recipes");

        if (!response.ok) {
          throw new Error("failed to fetch restaurants");
        }

        const data = await response.json();
        
        setRestaurants(data.recipes);
      } catch (error) {
        setError("Failed to fetch restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);
  return {restaurants , loading , error};
}

export default useRestaurants;
