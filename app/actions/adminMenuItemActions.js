"use server";

import { revalidatePath } from "next/cache";
import { updateMenuItem } from "@/lib/menuItems";

export async function updateMenuItemAction(formData) {
  // Hidden ids from the edit modal — restaurantId protects the nested admin
  // route, and menuItemId tells Prisma which MenuItem row to update.
  const restaurantId = formData.get("restaurantId");
  const menuItemId = formData.get("menuItemId");
  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim();
  const price = Number(formData.get("price"));
  const imageUrl = formData.get("imageUrl")?.trim();
  const category = formData.get("category")?.trim();
  const isVeg = formData.get("isVeg") === "on";

  if (!name || !category || !imageUrl) {
    return { error: "Name, category, and image URL are required" };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return { error: "Invalid image URL" };
  }

  if (Number.isNaN(price) || price <= 0) {
    return { error: "Price must be a positive number" };
  }

  const menuItemData = {
    name,
    description,
    price,
    imageUrl,
    category,
    isVeg,
  };

  const updatedMenuItem = await updateMenuItem(
    restaurantId,
    menuItemId,
    menuItemData,
  );

  if (!updatedMenuItem) {
    return { error: "Menu item not found" };
  }

  // Revalidate the exact nested admin page so router.refresh() shows the
  // latest menu item values after the Server Action finishes.
  revalidatePath(`/admin/restaurants/${restaurantId}/menu-items`);

  return { message: "Menu Item updated successfully" };
}
