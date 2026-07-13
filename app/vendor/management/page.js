import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getVendorRestaurant } from "@/lib/vendor";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import VendorManagementClient from "@/components/VendorManagementClient";

// Server Component — fetches restaurant + menuItems + operatingHours
// then hands them to VendorManagementClient which handles all interactivity.
export default async function VendorManagementPage() {
  noStore();

  const session = await getServerSession(authOptions);

  const restaurant = await getVendorRestaurant(session.user.id);
  if (!restaurant) redirect("/profile");

  // Serialize Decimal price before crossing the server/client boundary
  const serializedRestaurant = {
    ...restaurant,
    rating: Number(restaurant.rating),
    menuItems: restaurant.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };

  return <VendorManagementClient restaurant={serializedRestaurant} />;
}
