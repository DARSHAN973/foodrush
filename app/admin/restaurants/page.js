import { getAdminRestaurants, getPendingApplications } from "@/lib/restaurants";
import AdminRestaurantsClient from "@/components/AdminRestaurantsClient";
import { unstable_noStore as noStore } from "next/cache";

export default async function AdminRestaurants() {
  noStore();
  // Server/Client split — this page fetches database data on the server, then
  // passes plain restaurant objects to a Client Component for modal interactions.
  const [restaurants, pendingApplications] = await Promise.all([
    getAdminRestaurants(),
    getPendingApplications(),
  ]);

  return (
    <AdminRestaurantsClient
      restaurants={restaurants}
      pendingApplications={pendingApplications}
    />
  );
}
