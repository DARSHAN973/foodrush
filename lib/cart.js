import { prisma } from "@/lib/prisma";

const tempUserId = 1;

export async function getCart() {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: tempUserId,
    },
    include: {
      items: {
        include: {
          menuItem: {
            include: {
              restaurant: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }

  const totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.menuItem.price) * item.quantity;
  }, 0);

  return {
    items: cart.items,
    totalItems,
    totalPrice,
  };
}

export async function getCartCount() {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: tempUserId,
    },
    select: {
      items: {
        select: {
          quantity: true,
        },
      },
    },
  });

  if (!cart) {
    return 0;
  }

  const cartCount = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  return cartCount;
}
