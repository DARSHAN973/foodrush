import { prisma } from "@/lib/prisma";

export async function getRestaurants(filters = {}) {
  const { search, cuisine, rating, isOpen, sortBy } = filters;

  const where = {
    status: "ACTIVE",
  };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { cuisine: { contains: search } },
    ];
  }

  if (cuisine && cuisine !== "All") {
    where.cuisine = cuisine;
  }
  if (rating) {
    where.rating = {
      gte: Number(rating),
    };
  }
  if (isOpen === "true") {
    where.isOpen = true;
  }

  let orderBy = { rating: "desc" };

  if (sortBy === "rating") {
    orderBy = { rating: "desc" };
  } else if (sortBy === "time") {
    orderBy = { deliveryTime: "asc" };
  }

  // Database-backed list query — return only active restaurants and only the
  // fields the restaurant card UI needs.
  const restaurants = await prisma.restaurant.findMany({
    where,
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      deliveryTime: true,
      imageUrl: true,
      imagePublicId: true,
      isOpen: true,
    },
    orderBy,
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
export async function getCuisines() {
  const cuisines = await prisma.restaurant.findMany({
    where: { status: "ACTIVE" },
    select: {
      cuisine: true,
    },
    distinct: ["cuisine"],
  });
  return cuisines.map((r) => r.cuisine);
}

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
      status: "ACTIVE",
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
          imageUrl: true,
          price: true,
          category: true,
          isVeg: true,
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
      rating: data.rating,
      imageUrl: data.imageUrl,
      imagePublicId: data.imagePublicId,
    },
  });

  return {
    ...restaurant,
    rating: Number(restaurant.rating),
  };
}

export async function updateRestaurant(id, data) {
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
    },
  });

  if (restaurant === null) {
    return null;
  }

  const updateData = {};

  // PATCH partial update — collect only the fields sent by the client,
  // so Prisma updates changed columns without touching the rest.

  if (data.name) updateData.name = data.name;
  if (data.cuisine) updateData.cuisine = data.cuisine;
  if (data.deliveryTime) updateData.deliveryTime = data.deliveryTime;
  if (data.rating) updateData.rating = data.rating;
  if (data.imageUrl) updateData.imageUrl = data.imageUrl;
  if (data.imagePublicId) updateData.imagePublicId = data.imagePublicId;

  const updatedRestaurant = await prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: updateData,
  });

  return {
    ...updatedRestaurant,
    rating: Number(updatedRestaurant.rating),
  };
}

export async function deleteRestaurant(id) {
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      status: "ACTIVE",
    },
  });

  if (restaurant === null) {
    return null;
  }

  const inactiveRestaurant = await prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      status: "SUSPENDED",
    },
  });

  return {
    ...inactiveRestaurant,
    rating: Number(inactiveRestaurant.rating),
  };
}

export async function getAdminRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      deliveryTime: true,
      imageUrl: true,
      status: true,
      imagePublicId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return restaurants.map((restaurant) => ({
    ...restaurant,
    rating: Number(restaurant.rating),
  }));
}

export async function activeRestaurant(id) {
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
    },
  });

  if (restaurant === null) {
    return null;
  }

  const activeRestaurant = await prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return {
    ...activeRestaurant,
    rating: Number(activeRestaurant.rating),
  };
}

export async function getPendingApplications() {
  const pendingApplications = await prisma.restaurant.findMany({
    where: {
      status: "PENDING",
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      description: true,
      cuisine: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return pendingApplications;
}
