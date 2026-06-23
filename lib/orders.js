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
