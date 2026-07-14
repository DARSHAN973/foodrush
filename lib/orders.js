import { prisma } from "@/lib/prisma";

export async function getUserOrders(userId) {
  // Defensive validation — coerce userId to a number (session may serialize
  // it as a string) and reject anything that isn't a safe positive integer
  // before hitting the database. Prisma expects Int; passing NaN or a string
  // would throw a runtime error.

  const validUserId = Number(userId);
  if (!Number.isInteger(validUserId) || validUserId <= 0) {
    return null;
  }

  const userOrderList = await prisma.parentOrder.findMany({
    where: {
      userId: validUserId,
    },
    // Nested include — follows the one-to-many chain:
    // ParentOrder → restaurantOrders → restaurant (name) + items (OrderItem).
    // restaurant and items are not direct relations of ParentOrder, so they
    // must be included one level deep inside restaurantOrders.
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
  // Decimal conversion — Prisma returns Decimal objects (not plain numbers)
  // for all Decimal fields. Convert every nested level before returning,
  // otherwise React will throw "Objects are not valid as React children".
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

// getOrderById — fetches a single order with security ownership check.
// The WHERE clause combines id + userId so a user can never access
// another user's order by guessing the ID (IDOR attack prevention).
// Returns null if the order doesn't exist or doesn't belong to this user.
export async function getOrderById(orderId, userId) {
  const validOrderId = Number(orderId);
  const validUserId = Number(userId);

  if (
    !Number.isInteger(validOrderId) ||
    validOrderId <= 0 ||
    !Number.isInteger(validUserId) ||
    validUserId <= 0
  ) {
    return null;
  }

  const order = await prisma.parentOrder.findFirst({
    where: {
      id: validOrderId,
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
  });

  if (!order) {
    return null;
  }

  return {
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
  };
}
