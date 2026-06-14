import { prisma } from "@/lib/prisma";

const tempUserId = 1;

export async function getCart() {
  // Cart page query — include MenuItem and Restaurant because the UI needs item
  // price/name plus restaurant context like cuisine.
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
    // Empty cart shape — returning the same object structure keeps the cart page
    // simple and avoids null checks in the UI.
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
    // Decimal serialization — Prisma Decimal values must become plain numbers
    // before doing UI math or sending values into Client Components.
    return total + Number(item.menuItem.price) * item.quantity;
  }, 0);

  return {
    items: cart.items,
    totalItems,
    totalPrice,
  };
}

export async function getCartCount() {
  // Navbar count query — select only quantities because the badge does not need
  // full menu item or restaurant data.
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
