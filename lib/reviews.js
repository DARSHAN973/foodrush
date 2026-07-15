import { prisma } from "@/lib/prisma";

export async function getRestaurantReviews(restaurantId) {
  const validRestaurantId = Number(restaurantId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  // Run count + findMany in parallel — both need the same WHERE clause.
  // count gives us the true total even though findMany only fetches 5.
  const [totalCount, review] = await Promise.all([
    prisma.review.count({ where: { restaurantId: validRestaurantId } }),
    prisma.review.findMany({
      where: { restaurantId: validRestaurantId },
      select: {
        id: true,
        user: { select: { name: true } },
        rating: true,
        comment: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      // DB-level limit — never fetch more than 5 recent reviews.
      // Prevents returning 1000 rows on a popular restaurant.
      take: 5,
    }),
  ]);

  // Date serialization — Prisma returns createdAt as a JS Date object.
  // Date objects are NOT serializable when passed from a Server Component
  // to a Client Component. Convert to ISO string so React can pass them safely.
  return {
    reviews: review.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    totalCount,
  };
}

export async function canUserReviewRestaurant(userId, restaurantId) {
  const validRestaurantId = Number(restaurantId);
  const validUserId = Number(userId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }
  if (!Number.isInteger(validUserId) || validUserId <= 0) {
    return null;
  }

  const restaurantOrder = await prisma.restaurantOrder.findFirst({
    where: {
      restaurantId: validRestaurantId,
      status: "DELIVERED",
      parentOrder: {
        userId: validUserId,
      },
    },
  });

  if (!restaurantOrder) {
    return null;
  }

  const review = await prisma.review.findFirst({
    where: {
      restaurantId: validRestaurantId,
      userId: validUserId,
    },
  });

  if (!review) {
    return { canReview: true, orderId: restaurantOrder.id };
  }

  return { canReview: false, orderId: null };
}

export async function recalculateRestaurantRating(restaurantId) {
  const validRestaurantId = Number(restaurantId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  const reviews = await prisma.review.aggregate({
    where: {
      restaurantId: validRestaurantId,
    },
    _avg: {
      rating: true,
    },
  });

  const averageRating = reviews._avg.rating;
  if (!averageRating) {
    return 0;
  }

  await prisma.restaurant.update({
    where: {
      id: validRestaurantId,
    },
    data: {
      rating: averageRating,
    },
  });

  return averageRating;
}
