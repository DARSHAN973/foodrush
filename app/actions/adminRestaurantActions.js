"use server";

import {
  deleteRestaurant,
  updateRestaurant,
  activeRestaurant,
  createRestaurant,
} from "@/lib/restaurants";
import { revalidatePath } from "next/cache";

export async function updateRestaurantAction(formData) {
  // FormData from admin modal — inputs use name="" attributes, and the browser
  // sends their latest typed values to this Server Action.
  const id = formData.get("id");
  const name = formData.get("name")?.trim();
  const cuisine = formData.get("cuisine")?.trim();
  const deliveryTime = Number(formData.get("deliveryTime"));
  const rating = Number(formData.get("rating"));
  const imageUrl = formData.get("imageUrl")?.trim();

  if (!name || !cuisine || !imageUrl) {
    return { error: "Name, cuisine, and image are required" };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return { error: "Invalid image URL" };
  }

  if (!Number.isInteger(deliveryTime) || deliveryTime <= 0) {
    return { error: "Delivery time must be a positive number" };
  }

  if (Number.isNaN(rating) || rating < 0 || rating > 5) {
    return { error: "Rating must be between 0 and 5" };
  }

  const data = {
    name,
    cuisine,
    deliveryTime,
    rating,
    imageUrl,
  };

  await updateRestaurant(id, data);

  // Revalidate after mutation — the admin list is server-rendered, so Next needs
  // this path marked fresh before the browser refreshes the route.
  revalidatePath("/admin/restaurants");

  return { message: "Restaurant updated successfully" };
}

export async function deactivateRestaurantAction(id) {
  // Soft delete action — admin "delete" hides the restaurant by setting
  // isActive=false instead of removing historical data from the database.
  const inactiveRestaurant = await deleteRestaurant(id);

  if (!inactiveRestaurant) {
    return { error: "Restaurant not found" };
  }

  revalidatePath("/admin/restaurants");

  return { message: "Restaurant deactivated successfully" };
}

export async function activeRestaurantAction(id) {
  const activateRestaurant = await activeRestaurant(id);

  if (!activateRestaurant) {
    return { error: "Restaurant not found" };
  }

  revalidatePath("/admin/restaurants");

  return { message: "Restaurant activated successfully" };
}
export async function createRestaurantAction(formData) {
  const name = formData.get("name")?.trim();
  const cuisine = formData.get("cuisine")?.trim();
  const deliveryTime = Number(formData.get("deliveryTime"));
  const rating = Number(formData.get("rating"));
  const imageUrl = formData.get("imageUrl")?.trim();

  if (!name || !cuisine || !imageUrl) {
    return { error: "Name, cuisine, and image are required" };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return { error: "Invalid image URL" };
  }

  if (!Number.isInteger(deliveryTime) || deliveryTime <= 0) {
    return { error: "Delivery time must be a positive number" };
  }

  if (Number.isNaN(rating) || rating < 0 || rating > 5) {
    return { error: "Rating must be between 0 and 5" };
  }

  const data = {
    name,
    cuisine,
    deliveryTime,
    rating,
    imageUrl,
  };

  await createRestaurant(data);

  revalidatePath("/admin/restaurants");

  return { message: "Restaurant created successfully" };
}
