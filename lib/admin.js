import { prisma } from "@/lib/prisma";

//getAdminStats — Fetches platform-wide operational metrics for the Admin Dashboard.
// We query the database to calculate total orders, revenue, and active/pending orders.
export async function getAdminStats() {
  const totalOrders = await prisma.parentOrder.count({
    where: {
      status: { not: "PAYMENT_PENDING" },
    },
  });

  const totalUsers = await prisma.user.count({
    where: {
      role: "USER",
    },
  });

  const totalSpent = await prisma.parentOrder.aggregate({
    _sum: {
      total: true,
      platformFee: true,
      deliveryFee: true,
    },
    where: {
      status: { not: "PAYMENT_PENDING" },
    },
  });

  // Convert Prisma Decimal object to plain JS number. If we pass the raw
  // Decimal object to a page, React will throw a runtime rendering error.
  const totalRevenue = Number(totalSpent._sum.total || 0);
  const totalPlatformFee = Number(totalSpent._sum.platformFee || 0);
  const totalDeliveryFee = Number(totalSpent._sum.deliveryFee || 0);

  const totalRestaurants = await prisma.restaurant.count();

  const pendingOrders = await prisma.restaurantOrder.count({
    where: {
      status: { notIn: ["DELIVERED", "CANCELLED"] },
    },
  });

  return {
    totalOrders,
    totalRevenue,
    totalRestaurants,
    pendingOrders,
    totalPlatformFee,
    totalDeliveryFee,
    totalUsers,
  };
}

export async function getRecentOrders(limit = 10) {
  const orders = await prisma.parentOrder.findMany({
    where: {
      status: { not: "PAYMENT_PENDING" },
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    platformFee: Number(order.platformFee),
    total: Number(order.total),
  }));
}

export async function getAdminOrders() {
  const orders = await prisma.parentOrder.findMany({
    where: {
      status: { not: "PAYMENT_PENDING" },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },

      restaurantOrders: {
        include: {
          restaurant: true,
          items: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    platformFee: Number(order.platformFee),
    total: Number(order.total),
    restaurantOrders: order.restaurantOrders.map((ro) => ({
      ...ro,
      subtotal: Number(ro.subtotal),
      restaurant: ro.restaurant
        ? {
            ...ro.restaurant,
            rating: Number(ro.restaurant.rating),
          }
        : null,
      items: ro.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    })),
  }));
}
