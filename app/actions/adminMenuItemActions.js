"use server";

import { revalidatePath } from "next/cache";
import {
  updateMenuItem,
  createMenuItem,
  deactivateMenuItem,
  activeMenuItem,
  deleteMenuItem,
} from "@/lib/menuItems";
import { prisma } from "@/lib/prisma";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

function getMenuItemFormFields({
  name,
  description,
  price,
  imageUrl,
  category,
  isVeg,
}) {
  return { name, description, price, imageUrl, category, isVeg };
}

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
  const imagePublicId = formData.get("imagePublicId")?.trim();

  if (!name || !category || !imageUrl) {
    return { error: "Name, category, and image URL are required" };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return { error: "Invalid image URL" };
  }

  if (Number.isNaN(price) || price <= 0) {
    return { error: "Price must be a positive number" };
  }

  const oldMenuItem = await prisma.menuItem.findUnique({
    where: { id: Number(menuItemId) },
    select: { imagePublicId: true },
  });

  if (
    oldMenuItem?.imagePublicId &&
    oldMenuItem.imagePublicId !== imagePublicId
  ) {
    await deleteImageFromCloudinary(oldMenuItem.imagePublicId);
  }

  const menuItemData = {
    name,
    description,
    price,
    imageUrl,
    category,
    isVeg,
    imagePublicId,
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

export async function createMenuItemAction(formData) {
  const restaurantId = formData.get("restaurantId");
  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim();
  const price = Number(formData.get("price"));
  const imageUrl = formData.get("imageUrl")?.trim();
  const category = formData.get("category")?.trim();
  const isVeg = formData.get("isVeg") === "on";
  const imagePublicId = formData.get("imagePublicId")?.trim();

  if (!name || !category || !imageUrl) {
    return {
      error: "Name, category, and image URL are required",
      fields: getMenuItemFormFields({
        name,
        description,
        price,
        imageUrl,
        category,
        isVeg,
      }),
    };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return {
      error: "Invalid image URL",
      fields: getMenuItemFormFields({
        name,
        description,
        price,
        imageUrl,
        category,
        isVeg,
      }),
    };
  }

  if (Number.isNaN(price) || price <= 0) {
    return {
      error: "Price must be a positive number",
      fields: getMenuItemFormFields({
        name,
        description,
        price,
        imageUrl,
        category,
        isVeg,
      }),
    };
  }

  const menuItemData = {
    name,
    description,
    price,
    imageUrl,
    category,
    isVeg,
    imagePublicId,
  };

  const createdMenuItem = await createMenuItem(restaurantId, menuItemData);

  if (!createdMenuItem) {
    return {
      error: "Menu item not created",
      fields: getMenuItemFormFields({
        name,
        description,
        price,
        imageUrl,
        category,
        isVeg,
      }),
    };
  }

  revalidatePath(`/admin/restaurants/${restaurantId}/menu-items`);

  return { message: "Menu Item created successfully" };
}

export async function deactivateMenuItemAction(restaurantId, menuItemId) {
  const inactiveMenuItem = await deactivateMenuItem(restaurantId, menuItemId);

  if (!inactiveMenuItem) {
    return { error: "Menu Item not found" };
  }

  revalidatePath(`/admin/restaurants/${restaurantId}/menu-items`);

  return { message: "Menu Item deactivated successfully" };
}

export async function activeMenuItemAction(restaurantId, menuItemId) {
  const activateMenuItem = await activeMenuItem(restaurantId, menuItemId);

  if (!activateMenuItem) {
    return { error: "Menu Item not found" };
  }

  revalidatePath(`/admin/restaurants/${restaurantId}/menu-items`);

  return { message: "Menu Item activated successfully" };
}

export async function deleteMenuItemAction(restaurantId, menuItemId) {
  const deletedMenuItem = await deleteMenuItem(restaurantId, menuItemId);

  if (!deletedMenuItem) {
    return { error: "Menu Item not found" };
  }
  if (deletedMenuItem.imagePublicId) {
    await deleteImageFromCloudinary(deletedMenuItem.imagePublicId);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}/menu-items`);

  return { message: "Menu Item deleted successfully" };
}
