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
