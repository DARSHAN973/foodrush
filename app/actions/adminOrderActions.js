"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateRestaurantOrderStatusAction(
  restaurantOrderId,
  status,
) {
  const allowedStatuses = [
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(status)) {
    return { error: "Invalid status value" };
  }

  const validRestaurantOrderId = Number(restaurantOrderId);
  if (
    !Number.isInteger(validRestaurantOrderId) ||
    validRestaurantOrderId <= 0
  ) {
    return null;
  }

  const updatedOrder = await prisma.restaurantOrder.update({
    where: {
      id: validRestaurantOrderId,
    },
    data: {
      status: status,
    },
    include: {
      parentOrder: true,
    },
  });

  if (!updatedOrder) {
    return { error: "Order not found" };
  }

  const siblingOrder = await prisma.restaurantOrder.findMany({
    where: {
      parentOrderId: updatedOrder.parentOrderId,
    },
  });

  const siblingOrderStatuses = siblingOrder.map((s) => s.status);
  let newParentStatus = "PLACED";

  if (siblingOrderStatuses.every((status) => status === "DELIVERED")) {
    newParentStatus = "COMPLETED";
  } else if (siblingOrderStatuses.every((status) => status === "CANCELLED")) {
    newParentStatus = "CANCELLED";
  } else if (siblingOrderStatuses.some((status) => status === "DELIVERED")) {
    newParentStatus = "PARTIALLY_COMPLETED";
  }

  const updatedParentOrder = await prisma.parentOrder.update({
    where: {
      id: updatedOrder.parentOrderId,
    },
    data: {
      status: newParentStatus,
    },
  });

  if (!updatedParentOrder) {
    return { error: "Parent Order not found" };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/orders");

  return { success: true, message: "Order status updated successfully" };
}
