import { prisma } from "@/lib/prisma";

export async function getUserOrders(userId) {
  const validUserId = Number(userId);
  if (!Number.isInteger(validUserId) || validUserId <= 0) {
    return null;
  }

  const userOrderList = await prisma.parentOrder.findMany({
    where: {
      userId: validUserId,
    },
    include: {
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

  if (userOrderList.length === 0) {
    return null;
  }

  return userOrderList.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.deliveryFee),
    platformFee: Number(order.platformFee),
    total: Number(order.total),
    restaurantOrders: order.restaurantOrders.map((ro) => ({
      ...ro,
      subtotal: Number(ro.subtotal),
      items: ro.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    })),
  }));
}
