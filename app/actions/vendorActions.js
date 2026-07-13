"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// createVendorApplication — Server Action called from VendorApplicationForm.
// Creates a Restaurant row with status PENDING, linked to the logged-in user.
// Admin reviews PENDING restaurants in the Applications tab and approves/rejects.
export async function createVendorApplication(formData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to apply as a vendor." };
  }

  const userId = session.user.id;

  // Extract and sanitize form fields
  const name = formData.get("name")?.trim();
  const cuisine = formData.get("cuisine")?.trim();
  const address = formData.get("address")?.trim();
  const phone = formData.get("phone")?.trim() || null;
  const description = formData.get("description")?.trim() || null;

  if (!name || !cuisine || !address) {
    return { error: "Restaurant name, cuisine, and address are required." };
  }

  // Idempotency check — one vendor can only have one restaurant.
  // @@unique([ownerId]) on the schema enforces this at the DB level too,
  // but we check here first to return a friendly error message.
  const existing = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });

  if (existing) {
    return { error: "You already have an active restaurant application." };
  }

  await prisma.restaurant.create({
    data: {
      name,
      cuisine,
      address,
      phone,
      description,
      // status PENDING — admin must approve before this restaurant goes live.
      status: "PENDING",
      ownerId: userId,
      rating: 0,
      // Default delivery time — vendor updates this in their dashboard after approval.
      deliveryTime: 30,
    },
  });

  // Mark the profile page stale so Next.js refetches it and shows PENDING state.
  revalidatePath("/profile");
  return {
    message: "Application submitted! We'll review it within 24–48 hours.",
  };
}

export async function updateOrderStatus(orderId, newStatus) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to update order status." };
  }

  const validOrderId = Number(orderId);
  if (Number.isNaN(validOrderId)) {
    return { error: "Invalid order ID." };
  }

  const VALID_STATUS = [
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];
  if (!VALID_STATUS.includes(newStatus)) {
    return { error: "Invalid status." };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!restaurant) {
    return { error: "You are not a vendor." };
  }

  const restaurantOrder = await prisma.restaurantOrder.findUnique({
    where: { id: validOrderId },
  });

  if (!restaurantOrder) {
    return { error: "Order not found." };
  }
  if (restaurantOrder.restaurantId !== restaurant.id) {
    return { error: "You are not authorized to update this order." };
  }

  await prisma.restaurantOrder.update({
    where: { id: validOrderId },
    data: { status: newStatus },
  });

  // Revalidate both pages — orders list + dashboard stats both reflect the new status.
  revalidatePath("/vendor/orders");
  revalidatePath("/vendor");
  return { success: true };
}

export async function toggleRestaurantOpen() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to toggle restaurant status." };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!restaurant) {
    return { error: "You are not a vendor." };
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      isOpen: !restaurant.isOpen,
    },
  });

  revalidatePath("/vendor");
  revalidatePath("/vendor/management");
  return { success: true };
}

export async function updateRestaurantInfo(formData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to update restaurant info." };
  }
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!restaurant) {
    return { error: "You are not a vendor." };
  }

  const name = formData.get("name")?.trim();
  const cuisine = formData.get("cuisine")?.trim();
  const address = formData.get("address")?.trim() || null;
  const phone = formData.get("phone")?.trim() || null;
  const description = formData.get("description")?.trim() || null;

  if (!name || !cuisine) {
    return { error: "Restaurant name and cuisine are required." };
  }

  // Server-side phone validation — always validate on the server even if
  // the browser form already checks it. Client-side checks can be bypassed.
  // /^\d{10}$/ — exactly 10 digit characters, nothing else.
  if (phone && !/^\d{10}$/.test(phone)) {
    return { error: "Phone number must be exactly 10 digits." };
  }
  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { name, cuisine, address, phone, description },
  });
  revalidatePath("/vendor");
  revalidatePath("/vendor/management");
  return { success: true };
}

export async function toggleMenuItemAvailability(itemId) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to toggle menu item availability." };
  }

  const validItemId = Number(itemId);
  if (Number.isNaN(validItemId)) {
    return { error: "Invalid menu item ID." };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!restaurant) {
    return { error: "You are not a vendor." };
  }

  const menuItem = await prisma.menuItem.findUnique({
    where: { id: validItemId },
  });

  if (!menuItem) {
    return { error: "Menu item not found." };
  }

  if (menuItem.restaurantId !== restaurant.id) {
    return { error: "You are not authorized to update this menu item." };
  }
  await prisma.menuItem.update({
    where: { id: validItemId },
    data: {
      isAvailable: !menuItem.isAvailable,
    },
  });
  revalidatePath("/vendor");
  revalidatePath("/vendor/management");
  return { success: true };
}

export async function addMenuItem(formData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to add a menu item." };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!restaurant) {
    return { error: "You are not a vendor." };
  }

  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim() || null;
  const price = formData.get("price")?.trim() || null;
  const category = formData.get("category")?.trim() || null;
  const isVeg = formData.get("isVeg") || "true";

  if (!name || !price || !category) {
    return { error: "All fields are required." };
  }

  const validPrice = Number(price);
  if (Number.isNaN(validPrice)) {
    return { error: "Invalid price." };
  }
  if (validPrice <= 0) {
    return { error: "Price must be greater than 0." };
  }

  await prisma.menuItem.create({
    data: {
      name,
      description,
      price: validPrice,
      category,
      restaurantId: restaurant.id,
      isAvailable: true,
      isVeg: isVeg === "true",
      // imageUrl/imagePublicId come from Cloudinary via ImageUpload component.
      // They are optional — vendors can add items without images.
      imageUrl: formData.get("imageUrl") || null,
      imagePublicId: formData.get("imagePublicId") || null,
    },
  });

  revalidatePath("/vendor");
  revalidatePath("/vendor/management");
  return { success: true };
}

export async function updateMenuItem(itemId, formData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to update a menu item." };
  }
  const validItemId = Number(itemId);
  if (Number.isNaN(validItemId)) {
    return { error: "Invalid menu item ID." };
  }
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!restaurant) {
    return { error: "You are not a vendor." };
  }
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: validItemId },
  });
  if (!menuItem) return { error: "Menu item not found." };
  if (menuItem.restaurantId !== restaurant.id) {
    return { error: "You are not authorized to update this menu item." };
  }

  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim() || null;
  const price = formData.get("price")?.trim() || null;
  const category = formData.get("category")?.trim() || null;
  const isVeg = formData.get("isVeg") || "true";

  if (!name || !price || !category) {
    return { error: "All fields are required." };
  }

  const validPrice = Number(price);
  if (Number.isNaN(validPrice)) {
    return { error: "Invalid price." };
  }
  if (validPrice <= 0) {
    return { error: "Price must be greater than 0." };
  }

  await prisma.menuItem.update({
    where: { id: validItemId },
    data: {
      name,
      description,
      price: validPrice,
      category,
      isVeg: isVeg === "true",
      imageUrl: formData.get("imageUrl") || null,
      imagePublicId: formData.get("imagePublicId") || null,
    },
  });

  revalidatePath("/vendor");
  revalidatePath("/vendor/management");
  return { success: true };
}

export async function deleteMenuItem(itemId) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "You must be logged in to delete a menu item." };
  }
  const validItemId = Number(itemId);
  if (Number.isNaN(validItemId)) {
    return { error: "Invalid menu item ID." };
  }
  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!restaurant) {
    return { error: "You are not a vendor." };
  }
  const menuItem = await prisma.menuItem.findUnique({
    where: { id: validItemId },
  });
  if (!menuItem) return { error: "Menu item not found." };
  if (menuItem.restaurantId !== restaurant.id) {
    return { error: "You are not authorized to delete this menu item." };
  }

  await prisma.menuItem.delete({
    where: { id: validItemId },
  });

  revalidatePath("/vendor");
  revalidatePath("/vendor/management");
  return { success: true };
}
