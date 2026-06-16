import { getAdminMenuItems } from "@/lib/menuItems";
import AdminMenuItemsClient from "@/components/AdminMenuItemsClient";
import { notFound } from "next/navigation";

export default async function MenuItemsList({ params }) {
  const { id } = await params;

  // Nested admin route — the restaurant id comes from
  // /admin/restaurants/[id]/menu-items, then the server fetches that
  // restaurant with its menu items before handing data to the Client Component.
  const restaurant = await getAdminMenuItems(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <AdminMenuItemsClient
      restaurant={restaurant}
      menuItems={restaurant.menuItems}
    />
  );
}
