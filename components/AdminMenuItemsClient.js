"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  updateMenuItemAction,
  createMenuItemAction,
  deactivateMenuItemAction,
  activeMenuItemAction,
  deleteMenuItemAction,
} from "@/app/actions/adminMenuItemActions";
import ImageUpload from "@/components/ImageUpload";

export default function AdminMenuItemsClient({ restaurant, menuItems }) {
  const router = useRouter();

  // Modal state mirrors the restaurant admin pattern: null means no edit modal,
  // an item object means the form should open pre-filled for that menu item.
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [creatingMenuItem, setCreatingMenuItem] = useState(false);
  const [pendingMenuItemId, setPendingMenuItemId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

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
    setImageUrl("");
    setImagePublicId("");
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
      {/* Breadcrumbs navigation */}
      <nav className="mb-3 flex items-center flex-wrap gap-1.5 text-xs lg:text-sm font-semibold text-gray-400 select-none">
        <Link href="/admin" className="hover:text-orange-600 transition-colors">
          Admin
        </Link>
        <span className="text-gray-300">/</span>
        <Link
          href="/admin/restaurants"
          className="hover:text-orange-600 transition-colors"
        >
          Restaurants
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500 font-bold max-w-[120px] sm:max-w-none truncate">
          {restaurant.name}
        </span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-400 font-normal">Menu</span>
      </nav>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {restaurant.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage menu items.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreatingMenuItem(true);
            setImageUrl("");
            setImagePublicId("");
          }}
          className="w-full sm:w-auto text-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Add Menu Item
        </button>
      </div>

      {successMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-xl animate-fade-in-down">
          {successMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {menuItems.length === 0 && (
          <p className="px-6 py-10 text-center text-xs sm:text-sm text-gray-400 font-medium">
            No menu items yet. Add your first item to get started.
          </p>
        )}

        {menuItems.map((menuItem) => {
          const isPending = pendingMenuItemId === menuItem.id;
          const availabilityButtonText = menuItem.isAvailable
            ? "Mark Hide"
            : "Mark Active";
          const pendingAvailabilityButtonText = menuItem.isAvailable
            ? "Hiding..."
            : "Showing...";

          return (
            <div
              key={menuItem.id}
              className="flex flex-col border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  {menuItem.imageUrl ? (
                    <Image
                      src={menuItem.imageUrl}
                      alt={menuItem.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-xl">
                      {menuItem.isVeg ? "🟢" : "🔴"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-extrabold text-base sm:text-lg text-gray-900">
                    {menuItem.name}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500 font-medium">
                    {menuItem.category}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-gray-450">
                    <span className="font-extrabold text-gray-800">
                      ₹{menuItem.price.toFixed(2)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-200" />
                    <span className="font-bold flex items-center gap-1">
                      {menuItem.isVeg ? (
                        <>
                          <span className="text-[10px]">🟢</span> Veg
                        </>
                      ) : (
                        <>
                          <span className="text-[10px]">🔴</span> Non-Veg
                        </>
                      )}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border mt-2 ${
                      menuItem.isAvailable
                        ? "bg-green-50 text-green-700 border-green-200/60"
                        : "bg-gray-50 text-gray-500 border-gray-200/60"
                    }`}
                  >
                    {menuItem.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Stacked in 3-columns on mobile, row-aligned on desktop */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMenuItem(menuItem);
                    setImageUrl(menuItem.imageUrl || "");
                    setImagePublicId(menuItem.imagePublicId || "");
                  }}
                  disabled={isPending}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-center disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleMenuItemStatus(menuItem)}
                  disabled={isPending}
                  className="rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-center disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {isPending
                    ? pendingAvailabilityButtonText
                    : availabilityButtonText}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteMenuItem(menuItem)}
                  disabled={isPending}
                  className="rounded-xl border border-red-200 bg-red-55 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 hover:border-red-300 active:scale-95 transition-all text-center disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-auto animate-zoom-in">
            <div className="flex items-start justify-between gap-4 border-b border-gray-150 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Edit Menu Item
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Update the details shown across FoodRush.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-1.5 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                aria-label="Close edit form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleUpdateMenuItem}
              className="grid gap-4 px-5 py-5 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item Name
                </label>
                <input
                  name="name"
                  defaultValue={editingMenuItem.name}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingMenuItem.description || ""}
                  rows={2}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={editingMenuItem.price}
                  min="0"
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={editingMenuItem.category || ""}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item Image
                </label>
                <ImageUpload
                  onUploadSuccess={(url, publicId) => {
                    setImageUrl(url);
                    setImagePublicId(publicId);
                  }}
                  defaultImageUrl={imageUrl}
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
                <input
                  type="hidden"
                  name="imagePublicId"
                  value={imagePublicId}
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 py-1.5">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    name="isVeg"
                    defaultChecked={editingMenuItem.isVeg}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600"
                  />
                  Vegetarian Food Item
                </label>
              </div>

              <input
                type="hidden"
                name="menuItemId"
                value={editingMenuItem.id}
              />
              <input type="hidden" name="restaurantId" value={restaurant.id} />

              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4 mt-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-205 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 active:scale-95 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-auto animate-zoom-in">
            <div className="flex items-start justify-between gap-4 border-b border-gray-150 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Add Menu Item
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Add a brand new dish to the menu.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-1.5 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                aria-label="Close form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleCreateMenuItem}
              className="grid gap-4 px-5 py-5 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item Name
                </label>
                <input
                  name="name"
                  defaultValue={fields.name}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={fields.description}
                  rows={2}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={fields.price}
                  min="0"
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={fields.category}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Item Image
                </label>
                <ImageUpload
                  onUploadSuccess={(url, publicId) => {
                    setImageUrl(url);
                    setImagePublicId(publicId);
                  }}
                  defaultImageUrl={imageUrl}
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
                <input
                  type="hidden"
                  name="imagePublicId"
                  value={imagePublicId}
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 py-1.5">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-gray-700">
                  <input
                    type="checkbox"
                    name="isVeg"
                    defaultChecked={fields.isVeg}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600"
                  />
                  Vegetarian Food Item
                </label>
              </div>

              <input type="hidden" name="restaurantId" value={restaurant.id} />

              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4 mt-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-205 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 active:scale-95 transition cursor-pointer"
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
