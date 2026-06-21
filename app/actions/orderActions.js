// "use server" — marks every exported function in this file as a Server Action.
// Server Actions run exclusively on the server, so secrets (DB credentials,
// Razorpay key secret) are never exposed to the browser.
"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

export async function placeOrder({ address, phone }) {
  const trimmedAddress = address?.trim();
  const trimmedPhone = phone?.trim();

  if (!trimmedAddress) {
    return { error: "Address is required." };
  }
  if (!trimmedPhone || trimmedPhone.length !== 10) {
    return { error: "Phone number is not valid" };
  }

  // getServerSession — reads the JWT cookie on the server to identify the logged-in user.
  // Guard: bail out early if no session exists so we never write a dangling order.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return;
  const userId = session.user.id;

  // Fetch all cart items belonging to this user via the nested Cart relation.
  // We include menuItem to access price and restaurantId for grouping below.
  const cartItems = await prisma.cartItem.findMany({
    where: {
      cart: {
        userId: userId,
      },
    },
    include: {
      menuItem: true,
    },
  });

  // findMany always returns an array — check length, not truthiness, for emptiness.
  if (cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }

  // Compute the order totals on the server — never trust client-sent prices.
  // Prisma Decimal fields must be converted to Number before arithmetic.
  const subtotal = cartItems.reduce((total, item) => {
    return total + Number(item.menuItem.price) * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const platformFee = 5;

  const total = subtotal + deliveryFee + platformFee;

  // Group cart items by restaurantId so we can create one RestaurantOrder
  // per restaurant. This supports the multi-restaurant checkout design where
  // a single ParentOrder is split into per-restaurant order records.
  const itemsByRestaurant = {};

  cartItems.forEach((item) => {
    const restaurantId = item.menuItem.restaurantId;

    if (!itemsByRestaurant[restaurantId]) {
      itemsByRestaurant[restaurantId] = [];
    }
    itemsByRestaurant[restaurantId].push(item);
  });

  // prisma.$transaction — wraps all DB writes in an atomic block.
  // If any write fails, MySQL rolls back ALL changes so we never get
  // a partial order (e.g. ParentOrder created but OrderItems missing).
  // The callback receives `tx` — a transaction-scoped Prisma client.
  const order = await prisma.$transaction(async (tx) => {
    // Step A: Create the top-level invoice that represents the full checkout.
    // Status starts as PAYMENT_PENDING — it only becomes PAID after Razorpay
    // confirms the payment in the verifyPayment action.
    const parentOrder = await tx.parentOrder.create({
      data: {
        userId: userId,
        status: "PAYMENT_PENDING",
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        platformFee: platformFee,
        total: total,
        deliveryAddress: address,
        phone: phone,
      },
    });

    // Step B: Loop over each restaurant group and create one RestaurantOrder
    // per restaurant, linked to the parent via parentOrderId.
    for (const restaurantId in itemsByRestaurant) {
      const restaurantItems = itemsByRestaurant[restaurantId];
      const rSubtotal = restaurantItems.reduce(
        (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
        0,
      );

      const restOrder = await tx.restaurantOrder.create({
        data: {
          parentOrderId: parentOrder.id,
          restaurantId: parseInt(restaurantId),
          status: "PLACED",
          subtotal: rSubtotal,
        },
      });

      // Step C: Create one OrderItem row per cart item, snapshotting the
      // item name and price at time of order so future price changes don't
      // affect historical order records.
      for (const item of restaurantItems) {
        await tx.orderItem.create({
          data: {
            restaurantOrderId: restOrder.id,
            menuItemId: item.menuItem.id,
            itemName: item.menuItem.name,
            price: item.menuItem.price,
            quantity: item.quantity,
          },
        });
      }
    }

    return parentOrder;
  });
  // Create a Razorpay Order AFTER the DB transaction succeeds.
  // Razorpay requires amounts in paise (INR smallest unit), so multiply by 100.
  // The receipt ties the Razorpay order back to our internal ParentOrder id.
  // This is intentionally outside the transaction — external API calls must
  // never be inside a Prisma transaction because a network failure would leave
  // the DB in a rolled-back state with no way to recover.
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: `order_${order.id}`,
  });

  // Return the Razorpay order details to the client so CheckoutForm.js can
  // open the payment popup. The cart is NOT cleared here — it clears only
  // after the user's payment is verified in verifyPayment.
  revalidatePath("/cart");
  return {
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    parentOrderId: order.id,
  };
}

export async function verifyPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  parentOrderId,
}) {
  // Signature verification — this is the critical security step.
  // Anyone could fake a POST to this action with a real-looking payment_id.
  // The signature is an HMAC-SHA256 hash that only Razorpay can produce using
  // our shared secret key. We rebuild the hash ourselves and compare — if they
  // match, the payment is genuinely from Razorpay and not tampered with.
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return { error: "Payment verification failed." };
  }

  // Payment is verified — update the ParentOrder status from PAYMENT_PENDING
  // to PLACED. "PAID" is not a valid ParentOrderStatus enum value in schema.prisma.
  // PLACED means payment was received and the order is now active.
  await prisma.parentOrder.update({
    where: { id: parentOrderId },
    data: { status: "PLACED" },
  });

  // Cart is cleared HERE (not in placeOrder) because we only want to remove
  // items after we are 100% sure the payment succeeded. If we cleared the cart
  // in placeOrder and the user's payment failed or was abandoned, their cart
  // would be gone with nothing to show for it.
  const session = await getServerSession(authOptions);
  await prisma.cartItem.deleteMany({
    where: { cart: { userId: session.user.id } },
  });

  // Invalidate the cached cart page so the navbar count and cart page
  // reflect the newly empty cart immediately.
  revalidatePath("/cart");
  return { success: true };
}
