import { prisma } from "@/lib/prisma";

export async function getRestaurants() {
  // Revalidated fetch cache — Next.js can reuse this server fetch result
  // and refresh it in the background after 60 seconds.
  // Shared server cache — cached fetch results can be reused across server renders,
  // but this is not the same as realtime updates; users see fresh data after revalidation.
  const restaurants = await prisma.restaurant.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      deliveryTime: true,
      imageUrl: true,
    },
    orderBy: {
      rating: "desc",
    },
  });
  // Decimal serialization — Prisma returns Decimal fields as objects,
  // so convert rating to a plain number before sending data to UI/API code.
  return restaurants.map((restaurant) => ({
    ...restaurant,
    rating: Number(restaurant.rating),
  }));
}
// Shared restaurant detail fetch — returns null for missing restaurants
// so each caller can decide whether to show not-found UI or another response.
export async function getRestaurant(id) {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: Number(id),
      isActive: true,
    },
    include: {
      menuItems: {
        where: {
          isAvailable: true,
        },
      },
    },
  });
  if (restaurant === null) {
    return null;
  }

  return {
    ...restaurant,
    rating: Number(restaurant.rating),
    menuItems: restaurant.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}
