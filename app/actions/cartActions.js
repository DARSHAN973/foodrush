"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToCart(menuItemId) {
  const userId = 1;

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
      cartId_menuItemId: {
        cartId: cart.id,
        menuItemId: menuItemId,
      },
    },
  });

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + 1,
      },
    });
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
