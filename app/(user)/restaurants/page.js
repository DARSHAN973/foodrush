import RestaurantsClient from "@/components/RestaurantsClient";

// Server fetching in page.js — this runs before the page HTML is sent,
// so the route can render with restaurant data already available.
async function getRestaurants() {
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

// page.js route file — this component becomes the UI for /restaurants.
// In the App Router, folders define URLs and page.js defines the page.
// Server/client split — the Server Component fetches initial data,
// then the Client Component owns interactive search, filter, and sort UI.
export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return <RestaurantsClient restaurants={restaurants} />;
}
