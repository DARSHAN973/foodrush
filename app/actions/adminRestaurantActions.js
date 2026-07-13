"use server";

import {
  deleteRestaurant,
  updateRestaurant,
  activeRestaurant,
  createRestaurant,
} from "@/lib/restaurants";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function updateRestaurantAction(formData) {
  // FormData from admin modal — inputs use name="" attributes, and the browser
  // sends their latest typed values to this Server Action.
  const id = formData.get("id");
  const name = formData.get("name")?.trim();
  const cuisine = formData.get("cuisine")?.trim();
  const deliveryTime = Number(formData.get("deliveryTime"));
  const rating = Number(formData.get("rating"));
  const imageUrl = formData.get("imageUrl")?.trim();
  const imagePublicId = formData.get("imagePublicId")?.trim();

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
  const oldRestaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    select: { imagePublicId: true },
  });

  if (
    oldRestaurant?.imagePublicId &&
    oldRestaurant.imagePublicId !== imagePublicId
  ) {
    await deleteImageFromCloudinary(oldRestaurant.imagePublicId);
  }

  const data = {
    name,
    cuisine,
    deliveryTime,
    rating,
    imageUrl,
    imagePublicId,
  };

  await updateRestaurant(id, data);

  // Revalidate after mutation — the admin list is server-rendered, so Next needs
  // this path marked fresh before the browser refreshes the route.
  revalidatePath("/admin/restaurants");

  return { message: "Restaurant updated successfully" };
}

export async function deactivateRestaurantAction(id) {
  // Soft delete action — admin "delete" hides the restaurant by setting
  // status=SUSPENDED instead of removing historical data from the database.
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
  const imagePublicId = formData.get("imagePublicId")?.trim();

  if (!name || !cuisine || !imageUrl) {
    return {
      error: "Name, cuisine, and image are required",
      fields: { name: "", cuisine, deliveryTime, rating, imageUrl },
    };
  }

  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return {
      error: "Invalid image URL",
      fields: { name, cuisine, deliveryTime, rating, imageUrl: "" },
    };
  }

  if (!Number.isInteger(deliveryTime) || deliveryTime <= 0) {
    return {
      error: "Delivery time must be a positive number",
      fields: { name, cuisine, deliveryTime: "", rating, imageUrl: "" },
    };
  }

  if (Number.isNaN(rating) || rating < 0 || rating > 5) {
    return {
      error: "Rating must be between 0 and 5",
      fields: { name, cuisine, deliveryTime, rating: "", imageUrl: "" },
    };
  }

  const data = {
    name,
    cuisine,
    deliveryTime,
    rating,
    imageUrl,
    imagePublicId,
  };

  await createRestaurant(data);

  revalidatePath("/admin/restaurants");

  return { message: "Restaurant created successfully" };
}

// approveVendorAction — admin approves a PENDING vendor application.
// Uses prisma.$transaction to update BOTH tables atomically:
// If restaurant.status update succeeds but user.role update fails (or vice versa),
// the whole operation rolls back — no partial/inconsistent DB state.
export async function approveVendorAction(restaurantId, ownerId) {
  if (!restaurantId || !ownerId) {
    return { error: "Invalid restaurant or owner ID." };
  }

  await prisma.$transaction([
    // Set the restaurant live on the platform
    prisma.restaurant.update({
      where: { id: Number(restaurantId) },
      data: { status: "ACTIVE" },
    }),
    // Upgrade the user's role so they can access /vendor routes
    prisma.user.update({
      where: { id: Number(ownerId) },
      data: { role: "VENDOR" },
    }),
  ]);

  // Revalidate both pages — admin list refreshes and vendor's profile
  // shows the ACTIVE state immediately after the action completes.
  revalidatePath("/admin/restaurants");
  revalidatePath("/profile");

  return { message: "Vendor approved successfully. Restaurant is now live!" };
}

// rejectVendorAction — admin rejects a PENDING vendor application with a reason.
// The rejectionReason is shown to the vendor in their profile (State 4 UI).
export async function rejectVendorAction(restaurantId, reason) {
  if (!restaurantId) {
    return { error: "Invalid restaurant ID." };
  }

  if (!reason?.trim()) {
    return { error: "A rejection reason is required." };
  }

  await prisma.restaurant.update({
    where: { id: Number(restaurantId) },
    data: {
      status: "REJECTED",
      rejectionReason: reason.trim(),
    },
  });

  revalidatePath("/admin/restaurants");
  revalidatePath("/profile");

  return { message: "Application rejected. Vendor has been notified." };
}

// suspendVendorAction — admin force-suspends a restaurant.
// Works on both PENDING applications and already-ACTIVE restaurants.
// Vendor's profile shows SUSPENDED state.
export async function suspendVendorAction(restaurantId) {
  if (!restaurantId) {
    return { error: "Invalid restaurant ID." };
  }

  await prisma.restaurant.update({
    where: { id: Number(restaurantId) },
    data: { status: "SUSPENDED" },
  });

  revalidatePath("/admin/restaurants");
  revalidatePath("/profile");

  return { message: "Restaurant suspended successfully." };
}

// sendWarningAction — allows admins to send warnings to vendors.
// Warning messages are written to the VendorWarning model and show up in the vendor panel.
export async function sendWarningAction(restaurantId, message) {
  try {
    const resId = Number(restaurantId);
    if (!Number.isInteger(resId) || resId <= 0) {
      return { error: "Invalid restaurant ID." };
    }

    if (!message?.trim()) {
      return { error: "Warning message cannot be empty." };
    }
    const warning = await prisma.vendorWarning.create({
      data: {
        restaurantId: resId,
        message: message.trim(),
      },
    });

    revalidatePath("/admin/restaurants");

    return { message: "Warning sent successfully to the vendor!" };
  } catch (error) {
    console.error("Failed to send warning:", error);
    return { error: "Failed to send warning. Please try again." };
  }
}
