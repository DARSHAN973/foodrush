export async function getRestaurants() {
  // Revalidated fetch cache — Next.js can reuse this server fetch result
  // and refresh it in the background after 60 seconds.
  // Shared server cache — cached fetch results can be reused across server renders,
  // but this is not the same as realtime updates; users see fresh data after revalidation.
  const res = await fetch("https://dummyjson.com/recipes", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  const data = await res.json();
  return data.recipes;
}
// Shared restaurant detail fetch — returns null for missing restaurants
// so each caller can decide whether to show not-found UI or another response.
export async function getRestaurant(id) {
  const response = await fetch(`https://dummyjson.com/recipes/${id}`);
  
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant details");
  }

  return response.json();
}
