import { getRestaurants } from "@/lib/restaurants";
import AdminRestaurantsClient from "@/components/AdminRestaurantsClient";

export default async function AdminRestaurants() {
  // Server/Client split — this page fetches database data on the server, then
  // passes plain restaurant objects to a Client Component for modal interactions.
  const restaurants = await getRestaurants();

  return <AdminRestaurantsClient restaurants={restaurants} />;
}
