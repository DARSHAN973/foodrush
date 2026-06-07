import RestaurantsClient from "@/components/RestaurantsClient";
import { getRestaurants } from "@/lib/restaurants";

// Server fetching in page.js — this runs before the page HTML is sent,
// so the route can render with restaurant data already available.

// page.js route file — this component becomes the UI for /restaurants.
// In the App Router, folders define URLs and page.js defines the page.
// Server/client split — the Server Component fetches initial data,
// then the Client Component owns interactive search, filter, and sort UI.
export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return <RestaurantsClient restaurants={restaurants} />;
}
