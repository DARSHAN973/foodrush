"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCart(menuItemId) {
  // Temporary user id — keeps cart CRUD database-backed until real auth sessions
  // replace this with the logged-in user's id.
  const userId = 1;

  // Cart upsert — one user should have one active cart. If it already exists,
  // reuse it; otherwise create it before adding cart items.
  const cart = await prisma.cart.upsert({
    where: {
      userId: userId,
    },
    update: {},
    create: {
      userId: userId,
    },
  });
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      // Compound unique lookup — comes from @@unique([cartId, menuItemId]) in
      // Prisma schema and prevents duplicate rows for the same menu item.
      cartId_menuItemId: {
        cartId: cart.id,
        menuItemId: menuItemId,
      },
    },
  });

  if (existingCartItem) {
    // Same item added again — increase quantity instead of creating another
    // CartItem row, so checkout math stays simple.
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + 1,
      },
    });
    // Server Action revalidation — refreshes server-rendered cart UI after the
    // database mutation.
    revalidatePath("/cart");

    return;
  }

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      menuItemId: menuItemId,
      quantity: 1,
    },
  });
  revalidatePath("/cart");
}

export async function increaseCartItem(cartItemId) {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
  });

  if (!cartItem) {
    return;
  }

  await prisma.cartItem.update({
    where: {
      id: cartItemId,
    },
    data: {
      quantity: cartItem.quantity + 1,
    },
  });

  revalidatePath("/cart");
}

export async function removeCartItem(cartItemId) {
  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
  revalidatePath("/cart");
}

export async function decreaseCartItem(cartItemId) {
  const cartItem = await prisma.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
  });
  if (!cartItem) {
    return;
  }
  if (cartItem.quantity === 1) {
    // Quantity floor — decreasing from 1 removes the row instead of storing a
    // meaningless quantity of 0.
    await removeCartItem(cartItemId);
    return;
  } else {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: cartItem.quantity - 1,
      },
    });
  }
  revalidatePath("/cart");
}
