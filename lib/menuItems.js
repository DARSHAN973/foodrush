import { prisma } from "@/lib/prisma";

export async function getAdminMenuItems(id) {
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return null;
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
    },
    select: {
      id: true,
      name: true,
      menuItems: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          imagePublicId: true,
          price: true,
          category: true,
          isVeg: true,
          isAvailable: true,
        },
      },
    },
  });
  if (restaurant === null) {
    return null;
  }

  // Nested admin read — admin needs the restaurant plus all its menu items
  // on one page, including unavailable items that normal users should not see.
  // Decimal serialization keeps Prisma Decimal values safe for Client Components.
  return {
    ...restaurant,
    menuItems: restaurant.menuItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
}

export async function updateMenuItem(restaurantId, menuItemId, menuItemData) {
  const validRestaurantId = Number(restaurantId);
  const validMenuItemId = Number(menuItemId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  if (!Number.isInteger(validMenuItemId) || validMenuItemId <= 0) {
    return null;
  }

  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: validMenuItemId,
      restaurantId: validRestaurantId,
    },
  });

  if (menuItem === null) {
    return null;
  }

  const updateData = {};

  // Ownership check + PATCH update — the earlier findFirst proves this item
  // belongs to the current restaurant before updating only the submitted fields.
  if (menuItemData.name) updateData.name = menuItemData.name;
  if (menuItemData.description !== undefined)
    updateData.description = menuItemData.description;
  if (menuItemData.price) updateData.price = menuItemData.price;
  if (menuItemData.category) updateData.category = menuItemData.category;
  if (menuItemData.imageUrl) updateData.imageUrl = menuItemData.imageUrl;
  if (menuItemData.imagePublicId !== undefined) {
    updateData.imagePublicId = menuItemData.imagePublicId;
  }

  // Boolean update guard — false is a valid value, so check for undefined
  // instead of truthiness or non-veg updates would be ignored.
  if (menuItemData.isVeg !== undefined) {
    updateData.isVeg = menuItemData.isVeg;
  }

  const updatedMenuItems = await prisma.menuItem.update({
    where: {
      id: validMenuItemId,
    },
    data: updateData,
  });

  return {
    ...updatedMenuItems,
    price: Number(updatedMenuItems.price),
  };
}

export async function createMenuItem(restaurantId, menuItemData) {
  const validRestaurantId = Number(restaurantId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  // Parent existence check — create should fail gracefully when the URL has an
  // invalid restaurant id instead of letting Prisma throw a foreign-key error.
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: validRestaurantId,
    },
  });

  if (restaurant === null) {
    return null;
  }

  const menuItem = await prisma.menuItem.create({
    data: {
      name: menuItemData.name,
      description: menuItemData.description,
      price: menuItemData.price,
      category: menuItemData.category,
      imageUrl: menuItemData.imageUrl,
      imagePublicId: menuItemData.imagePublicId,
      isVeg: menuItemData.isVeg,
      restaurantId: validRestaurantId,
    },
  });
  return {
    ...menuItem,
    price: Number(menuItem.price),
  };
}

export async function deactivateMenuItem(restaurantId, menuItemId) {
  const validRestaurantId = Number(restaurantId);
  const validMenuItemId = Number(menuItemId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  if (!Number.isInteger(validMenuItemId) || validMenuItemId <= 0) {
    return null;
  }

  // Nested resource guard — status changes must prove the item belongs to the
  // restaurant page the admin is currently managing.
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: validMenuItemId,
      restaurantId: validRestaurantId,
    },
  });

  if (menuItem === null) {
    return null;
  }

  const inactiveMenuItem = await prisma.menuItem.update({
    where: {
      id: validMenuItemId,
    },
    data: {
      isAvailable: false,
    },
  });

  return {
    ...inactiveMenuItem,
    price: Number(inactiveMenuItem.price),
  };
}

export async function activeMenuItem(restaurantId, menuItemId) {
  const validRestaurantId = Number(restaurantId);
  const validMenuItemId = Number(menuItemId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  if (!Number.isInteger(validMenuItemId) || validMenuItemId <= 0) {
    return null;
  }

  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: validMenuItemId,
      restaurantId: validRestaurantId,
    },
  });

  if (menuItem === null) {
    return null;
  }

  const activeMenuItem = await prisma.menuItem.update({
    where: {
      id: validMenuItemId,
    },
    data: {
      isAvailable: true,
    },
  });

  return {
    ...activeMenuItem,
    price: Number(activeMenuItem.price),
  };
}

export async function deleteMenuItem(restaurantId, menuItemId) {
  const validRestaurantId = Number(restaurantId);
  const validMenuItemId = Number(menuItemId);

  if (!Number.isInteger(validRestaurantId) || validRestaurantId <= 0) {
    return null;
  }

  if (!Number.isInteger(validMenuItemId) || validMenuItemId <= 0) {
    return null;
  }

  // Intentional hard delete — admin can fully remove accidental menu items,
  // but the restaurantId guard prevents deleting an item from another restaurant.
  const menuItem = await prisma.menuItem.findFirst({
    where: {
      id: validMenuItemId,
      restaurantId: validRestaurantId,
    },
  });

  if (menuItem === null) {
    return null;
  }

  const deleteMenuItem = await prisma.menuItem.delete({
    where: {
      id: validMenuItemId,
    },
  });

  return {
    ...deleteMenuItem,
    price: Number(deleteMenuItem.price),
  };
}
