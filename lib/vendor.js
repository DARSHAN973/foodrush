import { prisma } from "@/lib/prisma";

export async function getVendorRestaurant(userId) {
  const validUserId = Number(userId);
  if (!Number.isInteger(validUserId) || validUserId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: validUserId,
    },
    include: {
      menuItems: true,
      operatingHours: true,
      warnings: { where: { isRead: false } },
      // Include the 5 most recent orders for the dashboard preview table.
      // The full orders list lives in /vendor/orders — this is just a snapshot.
      restaurantOrders: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (restaurant === null) return null;

  return {
    ...restaurant,
    menuItems: restaurant.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
    // Decimal serialization — subtotal is a Decimal object, convert to number
    // so it can be passed to Client Components and used in toLocaleString().
    restaurantOrders: restaurant.restaurantOrders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
    })),
  };
}

export async function getVendorOrders(restaurantId) {
  const validRestaurantId = Number(restaurantId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  const orders = await prisma.restaurantOrder.findMany({
    where: {
      restaurantId: validRestaurantId,
    },
    include: {
      items: { include: { menuItem: true } },
      parentOrder: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (orders.length === 0) return [];

  return orders;
}

// getVendorStats — fetches all 5 dashboard metrics in ONE shot using Promise.all.
// Each query is independent, so we run them in parallel instead of sequentially.
// Promise.all([q1, q2, q3]) resolves when ALL promises resolve — same pattern
// as admin/restaurants/page.js where we fetched restaurants + applications together.
export async function getVendorStats(restaurantId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // midnight — start of today

  const [
    totalOrders,
    todayOrders,
    revenueResult,
    activeMenuItems,
    unreadWarnings,
  ] = await Promise.all([
    // Count all RestaurantOrders for this restaurant
    prisma.restaurantOrder.count({
      where: { restaurantId },
    }),

    // Count only today's orders
    prisma.restaurantOrder.count({
      where: { restaurantId, createdAt: { gte: today } },
    }),

    // Sum subtotal of DELIVERED orders only (actual earned revenue)
    // aggregate() returns { _sum: { subtotal: Decimal | null } }
    prisma.restaurantOrder.aggregate({
      where: { restaurantId, status: "DELIVERED" },
      _sum: { subtotal: true },
    }),

    // Count available menu items
    prisma.menuItem.count({
      where: { restaurantId, isAvailable: true },
    }),

    // Count unread admin warnings
    prisma.vendorWarning.count({
      where: { restaurantId, isRead: false },
    }),
  ]);

  return {
    totalOrders,
    todayOrders,
    // _sum.subtotal is a Decimal object or null (if no delivered orders yet)
    totalRevenue: Number(revenueResult._sum.subtotal ?? 0),
    activeMenuItems,
    unreadWarnings,
  };
}
