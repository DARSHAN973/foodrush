import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCart() {
  // getServerSession — Next.js server-side equivalent of useSession().
  // Reads and decodes the JWT cookie to get the logged-in user's session data.
  // authOptions is passed so it knows which strategy and secret to use.
  const session = await getServerSession(authOptions);

  // Guard — if no session exists (user not logged in), return an empty cart
  // shape instead of crashing on a null userId.
  if (!session?.user?.id) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  // Cart page query — include MenuItem and Restaurant because the UI needs item
  // price/name plus restaurant context like cuisine.
  const cart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
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
  // getServerSession — reads the JWT cookie to get the logged-in user's id.
  // See getCart() above for full comment on how this works.
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return 0;
  }

  // Navbar count query — select only quantities because the badge does not need
  // full menu item or restaurant data.
  const cart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
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
