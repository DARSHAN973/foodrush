"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  canUserReviewRestaurant,
  recalculateRestaurantRating,
} from "@/lib/reviews";

export async function createReviewAction(formData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "User not authenticated" };
  }

  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment");
  const restaurantId = Number(formData.get("restaurantId"));

  if (!Number.isInteger(rating) || rating <= 0 || rating > 5) {
    return { error: "Invalid rating" };
  }
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return { error: "Invalid restaurant ID" };
  }

  const reviewStatus = await canUserReviewRestaurant(
    session.user.id,
    restaurantId,
  );

  if (!reviewStatus || !reviewStatus.canReview) {
    return { error: "You can only review one order per restaurant" };
  }

  const review = await prisma.review.create({
    data: {
      rating,
      comment,
      restaurantId,
      userId: Number(session.user.id),
      orderId: reviewStatus.orderId,
    },
  });

  const updatedRestaurantRating =
    await recalculateRestaurantRating(restaurantId);

  revalidatePath(`/restaurants/${restaurantId}`);

  return {
    success: true,
    message: "Review created successfully",
    rating: updatedRestaurantRating,
  };
}
