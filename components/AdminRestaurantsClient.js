"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deactivateRestaurantAction,
  updateRestaurantAction,
  activeRestaurantAction,
  createRestaurantAction,
} from "@/app/actions/adminRestaurantActions";
import ImageUpload from "@/components/ImageUpload";

export default function AdminRestaurantsClient({ restaurants }) {
  const router = useRouter();
  // Modal state stores the selected restaurant object. null means the modal is
  // closed; a restaurant object means edit that specific row.
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [creatingRestaurant, setCreatingRestaurant] = useState(false);
  const [pendingRestaurantId, setPendingRestaurantId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fields, setFields] = useState({
    name: "",
    cuisine: "",
    deliveryTime: "",
    rating: "",
    imageUrl: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  function closeEditModal() {
    setEditingRestaurant(null);
    setCreatingRestaurant(null);
    setImageUrl("");
  }

  function showSuccessToast(message) {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  }

  function showErrorMessage(error) {
    setErrorMessage(error);

    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  }

  async function handleUpdateRestaurant(formData) {
    setSuccessMessage("");
    setErrorMessage("");

    // Client action wrapper — call the Server Action, then use its returned
    // state to decide whether to show an error or close the modal.
    const result = await updateRestaurantAction(formData);

    if (result?.error) {
      showErrorMessage(result.error);
      return;
    }

    setEditingRestaurant(null);
    showSuccessToast(result?.message || "Restaurant updated successfully");
    // router.refresh() refetches the current Server Component tree so the list
    // shows the newly revalidated database values without manual local syncing.
    router.refresh();
  }

  async function handleCreateRestaurant(formData) {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await createRestaurantAction(formData);

    if (result?.error) {
      showErrorMessage(result.error);
      setFields(result.fields);
      return;
    }

    setCreatingRestaurant(false);
    showSuccessToast(result?.message || "Restaurant created successfully");
    // router.refresh() refetches the current Server Component tree so the list
    // shows the newly revalidated database values without manual local syncing.
    router.refresh();
  }

  async function handleToggleRestaurantStatus(restaurant) {
    // Row-level pending state — store the clicked restaurant id so only that
    // row shows Activating/Deactivating while the Server Action runs.
    setPendingRestaurantId(Number(restaurant.id));
    setErrorMessage("");

    // Toggle action — the full restaurant object gives us both id and isActive,
    // so one handler can activate inactive rows and deactivate active rows.
    const result = restaurant.isActive
      ? await deactivateRestaurantAction(restaurant.id)
      : await activeRestaurantAction(restaurant.id);
    if (result?.error) {
      showErrorMessage(result.error);
      setPendingRestaurantId(null);
      return;
    }
    showSuccessToast(result.message);
    setPendingRestaurantId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Restaurants
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Manage restaurant listings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreatingRestaurant(true);
            setImageUrl("");
          }}
          className="w-full sm:w-auto text-center rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Add Restaurant
        </button>
      </div>

      {successMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-xl animate-fade-in-down">
          {successMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {restaurants.map((restaurant) => {
          const isStatusPending = pendingRestaurantId === restaurant.id;
          const statusButtonText = restaurant.isActive
            ? "Deactivate"
            : "Activate";
          const pendingStatusButtonText = restaurant.isActive
            ? "Deactivating..."
            : "Activating...";

          return (
            <div
              key={restaurant.id}
              className="flex flex-col border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                  {restaurant.imageUrl ? (
                    <Image
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-400">
                      FR
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-extrabold text-base sm:text-lg text-gray-900">
                    {restaurant.name}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500 font-medium">
                    {restaurant.cuisine}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      ★ {restaurant.rating}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-200" />
                    <span>{restaurant.deliveryTime} mins</span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border mt-2 ${
                      restaurant.isActive
                        ? "bg-green-50 text-green-700 border-green-200/60"
                        : "bg-gray-50 text-gray-500 border-gray-200/60"
                    }`}
                  >
                    {restaurant.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Stacked in 3-columns on mobile, row-aligned on desktop */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-end sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRestaurant(restaurant);
                    setImageUrl(restaurant.imageUrl || "");
                  }}
                  disabled={isStatusPending}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-center disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  Edit
                </button>
                <Link
                  href={`/admin/restaurants/${restaurant.id}/menu-items`}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all text-center cursor-pointer"
                >
                  Menu
                </Link>
                <button
                  type="button"
                  onClick={() => handleToggleRestaurantStatus(restaurant)}
                  disabled={isStatusPending}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold active:scale-95 transition-all text-center cursor-pointer ${
                    restaurant.isActive
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "border-green-200 text-green-700 hover:bg-green-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isStatusPending ? pendingStatusButtonText : statusButtonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-auto animate-zoom-in">
            <div className="flex items-start justify-between gap-4 border-b border-gray-150 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Edit Restaurant
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Update the details shown across FoodRush.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-xl p-1.5 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                aria-label="Close edit form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleUpdateRestaurant}
              className="grid gap-4 px-5 py-5 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Restaurant Name
                </label>
                <input
                  name="name"
                  defaultValue={editingRestaurant.name}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cuisine
                </label>
                <input
                  name="cuisine"
                  defaultValue={editingRestaurant.cuisine}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Delivery Time (mins)
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  defaultValue={editingRestaurant.deliveryTime}
                  min="1"
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={editingRestaurant.rating}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Restaurant Banner Image
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

              <input type="hidden" name="id" value={editingRestaurant.id} />

              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4 mt-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeEditModal}
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

      {creatingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-auto animate-zoom-in">
            <div className="flex items-start justify-between gap-4 border-b border-gray-150 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Create New Restaurant
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Add a brand new restaurant partner.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-xl p-1.5 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                aria-label="Close edit form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleCreateRestaurant}
              className="grid gap-4 px-5 py-5 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Restaurant Name
                </label>
                <input
                  name="name"
                  defaultValue={fields.name}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Cuisine
                </label>
                <input
                  name="cuisine"
                  defaultValue={fields.cuisine}
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Delivery Time (mins)
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  defaultValue={fields.deliveryTime}
                  min="1"
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Initial Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={fields.rating}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded-xl border border-gray-250 px-3.5 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Restaurant Banner Image
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

              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4 mt-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-gray-205 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 active:scale-95 transition cursor-pointer"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
