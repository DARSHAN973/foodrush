import { prisma } from "@/lib/prisma";

export async function getRestaurants() {
  // Database-backed list query — return only active restaurants and only the
  // fields the restaurant card UI needs.
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
  const restaurantId = Number(id);

  // Route param validation — URL params are strings, but Restaurant.id is an Int.
  // Invalid ids are treated like missing restaurants instead of querying Prisma.
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      deliveryTime: true,
      imageUrl: true,
      menuItems: {
        where: {
          isAvailable: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
        },
      },
    },
  });
  if (restaurant === null) {
    return null;
  }

  // Decimal serialization — detail data also needs plain numbers before it is
  // sent to route handlers or Client Components.
  return {
    ...restaurant,
    rating: Number(restaurant.rating),
    menuItems: restaurant.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}

export async function createRestaurant(data) {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      cuisine: data.cuisine,
      deliveryTime: data.deliveryTime,
    },
  });

  return {
    ...restaurant,
    rating: Number(restaurant.rating),
  };
}
