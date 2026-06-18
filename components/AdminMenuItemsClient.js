"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  updateMenuItemAction,
  createMenuItemAction,
  deactivateMenuItemAction,
  activeMenuItemAction,
  deleteMenuItemAction,
} from "@/app/actions/adminMenuItemActions";

export default function AdminMenuItemsClient({ restaurant, menuItems }) {
  const router = useRouter();

  // Modal state mirrors the restaurant admin pattern: null means no edit modal,
  // an item object means the form should open pre-filled for that menu item.
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [creatingMenuItem, setCreatingMenuItem] = useState(false);
  const [pendingMenuItemId, setPendingMenuItemId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fields, setFields] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: false,
    imageUrl: "",
  });

  function closeModal() {
    setEditingMenuItem(null);
    setCreatingMenuItem(false);
  }

  function showSuccessToast(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2500);
  }

  function showErrorMessage(error) {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 5000);
  }

  async function handleUpdateMenuItem(formData) {
    setSuccessMessage("");
    setErrorMessage("");

    // Client wrapper around the Server Action — wait for validation/mutation,
    // then close the modal and refresh the server-rendered list on success.
    const result = await updateMenuItemAction(formData);

    if (result?.error) {
      showErrorMessage(result.error);
      return;
    }

    setEditingMenuItem(null);
    showSuccessToast(result?.message || "Menu item updated successfully");
    router.refresh();
  }

  async function handleCreateMenuItem(formData) {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await createMenuItemAction(formData);

    if (result?.error) {
      showErrorMessage(result.error);
      if (result.fields) {
        setFields(result.fields);
      }
      return;
    }

    setCreatingMenuItem(false);
    setFields({
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: false,
      imageUrl: "",
    });
    showSuccessToast(result?.message || "Menu item created successfully");
    router.refresh();
  }

  async function handleDeleteMenuItem(menuItem) {
    setPendingMenuItemId(Number(menuItem.id));
    setErrorMessage("");

    const result = await deleteMenuItemAction(restaurant.id, menuItem.id);

    if (result?.error) {
      showErrorMessage(result.error);
      setPendingMenuItemId(null);
      return;
    }

    showSuccessToast(result?.message || "Menu item deleted successfully");
    setPendingMenuItemId(null);
    router.refresh();
  }

  async function handleToggleMenuItemStatus(menuItem) {
    setPendingMenuItemId(Number(menuItem.id));
    setErrorMessage("");

    // Toggle action — pass both ids so the Server Action updates only menu
    // items that belong to this restaurant's admin page.
    const result = menuItem.isAvailable
      ? await deactivateMenuItemAction(restaurant.id, menuItem.id)
      : await activeMenuItemAction(restaurant.id, menuItem.id);
    if (result?.error) {
      showErrorMessage(result.error);
      setPendingMenuItemId(null);
      return;
    }
    showSuccessToast(result.message);
    setPendingMenuItemId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {restaurant.name}
          </h1>
          <p className="mt-1 text-gray-600">Manage menu items.</p>
        </div>

        <button
          type="button"
          onClick={() => setCreatingMenuItem(true)}
          className="w-fit rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Add Menu Item
        </button>
      </div>

      {successMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-md">
          {successMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {menuItems.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            No menu items yet. Add your first item to get started.
          </p>
        )}

        {menuItems.map((menuItem) => {
          const isPending = pendingMenuItemId === menuItem.id;
          const availabilityButtonText = menuItem.isAvailable
            ? "Mark Unavailable"
            : "Mark Available";
          const pendingAvailabilityButtonText = menuItem.isAvailable
            ? "Hiding..."
            : "Showing...";

          return (
            <div
              key={menuItem.id}
              className="flex flex-col gap-4 border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {menuItem.imageUrl ? (
                    <Image
                      src={menuItem.imageUrl}
                      alt={menuItem.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
                      {menuItem.isVeg ? "🟢" : "🔴"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-gray-900">
                    {menuItem.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {menuItem.category}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span>₹{menuItem.price.toFixed(2)}</span>
                    <span>{menuItem.isVeg ? "Veg" : "Non-Veg"}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      menuItem.isAvailable
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {menuItem.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingMenuItem(menuItem)}
                  disabled={isPending}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleMenuItemStatus(menuItem)}
                  disabled={isPending}
                  className={`rounded-md border px-3 py-2 text-sm font-medium ${
                    menuItem.isAvailable
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "border-green-200 text-green-700 hover:bg-green-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isPending
                    ? pendingAvailabilityButtonText
                    : availabilityButtonText}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteMenuItem(menuItem)}
                  disabled={isPending}
                  className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Edit Modal ── */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl md:w-3/4">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Menu Item
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the details shown across FoodRush.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close edit form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleUpdateMenuItem}
              className="grid gap-5 px-6 py-6 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  name="name"
                  defaultValue={editingMenuItem.name}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingMenuItem.description || ""}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={editingMenuItem.price}
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={editingMenuItem.category || ""}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  defaultValue={editingMenuItem.imageUrl || ""}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isVeg"
                    defaultChecked={editingMenuItem.isVeg}
                    className="h-4 w-4 accent-orange-600"
                  />
                  Veg
                </label>
              </div>

              {/* Hidden relation ids — visible fields edit item data, while these
                  ids tell the Server Action which restaurant/item pair to update. */}
              <input
                type="hidden"
                name="menuItemId"
                value={editingMenuItem.id}
              />
              <input type="hidden" name="restaurantId" value={restaurant.id} />

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Modal ── */}
      {creatingMenuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl md:w-3/4">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add Menu Item
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleCreateMenuItem}
              className="grid gap-5 px-6 py-6 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  name="name"
                  defaultValue={fields.name}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={fields.description}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={fields.price}
                  min="0"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={fields.category}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  defaultValue={fields.imageUrl}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="isVeg"
                    defaultChecked={fields.isVeg}
                    className="h-4 w-4 accent-orange-600"
                  />
                  Veg
                </label>
              </div>

              <input type="hidden" name="restaurantId" value={restaurant.id} />

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Add Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
