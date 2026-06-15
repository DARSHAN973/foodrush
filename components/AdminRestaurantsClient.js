"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deactivateRestaurantAction,
  updateRestaurantAction,
} from "@/app/actions/adminRestaurantActions";

export default function AdminRestaurantsClient({ restaurants }) {
  const router = useRouter();
  // Modal state stores the selected restaurant object. null means the modal is
  // closed; a restaurant object means edit that specific row.
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function closeEditModal() {
    setEditingRestaurant(null);
  }

  function showSuccessToast(message) {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);
  }

  async function handleUpdateRestaurant(formData) {
    setSuccessMessage("");
    setErrorMessage("");

    // Client action wrapper — call the Server Action, then use its returned
    // state to decide whether to show an error or close the modal.
    const result = await updateRestaurantAction(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      return;
    }

    setEditingRestaurant(null);
    showSuccessToast(result?.message || "Restaurant updated successfully");
    // router.refresh() refetches the current Server Component tree so the list
    // shows the newly revalidated database values without manual local syncing.
    router.refresh();
  }

  async function handleDeactivateRestaurant(id) {
    setSuccessMessage("");
    setErrorMessage("");

    const result = await deactivateRestaurantAction(id);

    if (result?.error) {
      setErrorMessage(result.error);
      return;
    }

    showSuccessToast(result?.message || "Restaurant deactivated successfully");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-1 text-gray-600">Manage restaurant listings.</p>
        </div>

        <Link
          href="/admin/restaurants/new"
          className="w-fit rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Add Restaurant
        </Link>
      </div>

      {successMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-md">
          {successMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="flex flex-col gap-4 border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {restaurant.imageUrl ? (
                  <Image
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
                    FR
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate font-semibold text-gray-900">
                  {restaurant.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {restaurant.cuisine}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>Rating {restaurant.rating}</span>
                  <span>{restaurant.deliveryTime} mins</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setEditingRestaurant(restaurant)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <Link
                href={`/admin/restaurants/${restaurant.id}/menu-items`}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Menu Items
              </Link>
              <button
                type="button"
                onClick={() => handleDeactivateRestaurant(restaurant.id)}
                className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl md:w-3/4">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Restaurant
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the details shown across FoodRush.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-md px-2 py-1 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close edit form"
              >
                &times;
              </button>
            </div>

            <form
              action={handleUpdateRestaurant}
              className="grid gap-5 px-6 py-6 sm:grid-cols-2"
            >
              {errorMessage && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <input
                  name="name"
                  defaultValue={editingRestaurant.name}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Cuisine
                </label>
                <input
                  name="cuisine"
                  defaultValue={editingRestaurant.cuisine}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Delivery Time
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  defaultValue={editingRestaurant.deliveryTime}
                  min="1"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={editingRestaurant.rating}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  name="imageUrl"
                  defaultValue={editingRestaurant.imageUrl || ""}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              {/* Hidden id — Server Actions receive FormData, so the restaurant
                  id must travel with the form even though admins should not edit it. */}
              <input type="hidden" name="id" value={editingRestaurant.id} />

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeEditModal}
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
    </div>
  );
}
