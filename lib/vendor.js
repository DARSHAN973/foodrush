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
    // Decimal serialization — subtotal and each OrderItem.price are Decimal
    // objects. Convert every Decimal field so the data is plain-object safe
    // when passed to Client Components (same pattern as getVendorOrders below).
    restaurantOrders: restaurant.restaurantOrders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
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

  // Decimal serialization — Prisma returns Decimal objects for all Decimal
  // schema fields (subtotal, deliveryFee, platformFee, total, price).
  // These cannot cross the Server → Client Component boundary as-is.
  // Convert every Decimal at the lib layer so every caller gets plain numbers.
  return orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    // parentOrder is included so the vendor can see the customer's full order
    // details. It has its own set of Decimal financials — convert all four.
    parentOrder: order.parentOrder
      ? {
          ...order.parentOrder,
          subtotal: Number(order.parentOrder.subtotal),
          deliveryFee: Number(order.parentOrder.deliveryFee),
          platformFee: Number(order.parentOrder.platformFee),
          total: Number(order.parentOrder.total),
        }
      : null,
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
      // menuItem is included via { include: { menuItem: true } } — it also
      // has a price Decimal field that must be converted.
      menuItem: item.menuItem
        ? { ...item.menuItem, price: Number(item.menuItem.price) }
        : null,
    })),
  }));
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
