"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deactivateRestaurantAction,
  activeRestaurantAction,
  approveVendorAction,
  rejectVendorAction,
  suspendVendorAction,
} from "@/app/actions/adminRestaurantActions";

export default function AdminRestaurantsClient({
  restaurants,
  pendingApplications,
}) {
  const router = useRouter();

  // activeTab — controls which panel is visible: "restaurants" or "applications"
  const [activeTab, setActiveTab] = useState("restaurants");

  // pendingRestaurantId — tracks which restaurant row is in a loading state
  // on the Restaurants tab (Force Suspend / Unsuspend action)
  const [pendingRestaurantId, setPendingRestaurantId] = useState(null);

  // actionPendingId — tracks which application card is loading
  // (Approve / Reject / Suspend on the Applications tab)
  const [actionPendingId, setActionPendingId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // rejectModal — drives the reject reason modal.
  // Stores restaurantId, ownerId, and the typed reason so the action has all it needs.
  const [rejectModal, setRejectModal] = useState({
    open: false,
    restaurantId: null,
    ownerId: null,
    reason: "",
  });

  function showSuccessToast(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 2500);
  }

  function showErrorToast(error) {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(""), 5000);
  }

  function closeRejectModal() {
    setRejectModal({
      open: false,
      restaurantId: null,
      ownerId: null,
      reason: "",
    });
  }

  // handleToggleRestaurantStatus — used on the Restaurants tab.
  // ACTIVE → Force Suspend (sets status=SUSPENDED)
  // SUSPENDED → Unsuspend (sets status=ACTIVE)
  async function handleToggleRestaurantStatus(restaurant) {
    setPendingRestaurantId(Number(restaurant.id));
    setErrorMessage("");

    const result =
      restaurant.status === "ACTIVE"
        ? await deactivateRestaurantAction(restaurant.id)
        : await activeRestaurantAction(restaurant.id);

    if (result?.error) {
      showErrorToast(result.error);
      setPendingRestaurantId(null);
      return;
    }
    showSuccessToast(result.message);
    setPendingRestaurantId(null);
    router.refresh();
  }

  async function handleApprove(restaurantId, ownerId) {
    setActionPendingId(restaurantId);
    setErrorMessage("");

    const result = await approveVendorAction(restaurantId, ownerId);

    if (result?.error) {
      showErrorToast(result.error);
      setActionPendingId(null);
      return;
    }
    showSuccessToast(result.message);
    setActionPendingId(null);
    router.refresh();
  }

  async function handleRejectConfirm() {
    setActionPendingId(rejectModal.restaurantId);
    setErrorMessage("");

    const result = await rejectVendorAction(
      rejectModal.restaurantId,
      rejectModal.reason,
    );

    if (result?.error) {
      showErrorToast(result.error);
      setActionPendingId(null);
      return;
    }
    closeRejectModal();
    showSuccessToast(result.message);
    setActionPendingId(null);
    router.refresh();
  }

  async function handleSuspendApplication(restaurantId) {
    setActionPendingId(restaurantId);
    setErrorMessage("");

    const result = await suspendVendorAction(restaurantId);

    if (result?.error) {
      showErrorToast(result.error);
      setActionPendingId(null);
      return;
    }
    showSuccessToast(result.message);
    setActionPendingId(null);
    router.refresh();
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Manage Restaurants
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Review vendor applications and control all restaurant listings.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`px-5 py-2.5 text-sm font-bold rounded-t-xl border-b-2 -mb-px transition-all cursor-pointer ${
            activeTab === "restaurants"
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-t-xl border-b-2 -mb-px transition-all cursor-pointer ${
            activeTab === "applications"
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Applications
          {/* Badge — only shown when there are pending applications waiting */}
          {pendingApplications.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
              {pendingApplications.length}
            </span>
          )}
        </button>
      </div>

      {/* Global Toast Messages */}
      {successMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-xl">
          {successMessage}
        </div>
      )}

      {/* ─── TAB: RESTAURANTS ──────────────────────────────────────── */}
      {activeTab === "restaurants" && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {restaurants.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No restaurants found.
            </div>
          ) : (
            restaurants.map((restaurant) => {
              const isRowPending = pendingRestaurantId === restaurant.id;

              return (
                <div
                  key={restaurant.id}
                  className="flex flex-col border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  {/* Restaurant Info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
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
                      <h2 className="truncate font-extrabold text-base text-gray-900">
                        {restaurant.name}
                      </h2>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {restaurant.cuisine}
                      </p>
                      {/* Status pill — color-coded by enum value */}
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border mt-1.5 ${
                          restaurant.status === "ACTIVE"
                            ? "bg-green-50 text-green-700 border-green-200/60"
                            : restaurant.status === "SUSPENDED"
                              ? "bg-red-50 text-red-600 border-red-200/60"
                              : "bg-gray-50 text-gray-500 border-gray-200/60"
                        }`}
                      >
                        {restaurant.status}
                      </span>
                    </div>
                  </div>

                  {/* Force Suspend / Unsuspend — admin override */}
                  <button
                    type="button"
                    onClick={() => handleToggleRestaurantStatus(restaurant)}
                    disabled={isRowPending}
                    className={`shrink-0 rounded-xl border px-4 py-2 text-xs font-bold active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                      restaurant.status === "ACTIVE"
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {isRowPending
                      ? restaurant.status === "ACTIVE"
                        ? "Suspending..."
                        : "Activating..."
                      : restaurant.status === "ACTIVE"
                        ? "Force Suspend"
                        : "Unsuspend"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─── TAB: APPLICATIONS ─────────────────────────────────────── */}
      {activeTab === "applications" && (
        <div>
          {pendingApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/30 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
                🎉
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                All caught up!
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                No pending vendor applications right now.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((app) => {
                const isActionPending = actionPendingId === app.id;

                return (
                  <div
                    key={app.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4">
                      <div>
                        <h2 className="font-extrabold text-base text-gray-900">
                          {app.name}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {app.cuisine} · Applied{" "}
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Pending Review
                      </span>
                    </div>

                    {/* Card Body — all vendor-submitted details */}
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 px-5 py-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Vendor
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {app.owner?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {app.owner?.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          Address
                        </p>
                        <p className="text-sm text-gray-700">
                          {app.address || "—"}
                        </p>
                      </div>

                      {app.phone && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Phone
                          </p>
                          <p className="text-sm text-gray-700">{app.phone}</p>
                        </div>
                      )}

                      {app.description && (
                        <div className="sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {app.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-3">
                      <button
                        onClick={() => handleApprove(app.id, app.owner?.id)}
                        disabled={isActionPending}
                        className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isActionPending ? "Processing..." : "✓ Approve"}
                      </button>

                      <button
                        onClick={() =>
                          setRejectModal({
                            open: true,
                            restaurantId: app.id,
                            ownerId: app.owner?.id,
                            reason: "",
                          })
                        }
                        disabled={isActionPending}
                        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        ✕ Reject
                      </button>

                      <button
                        onClick={() => handleSuspendApplication(app.id)}
                        disabled={isActionPending}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                      >
                        ⊘ Suspend
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── REJECT REASON MODAL ───────────────────────────────────── */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-zoom-in">
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Reject Application
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  The vendor will see this reason in their profile.
                </p>
              </div>
              <button
                onClick={closeRejectModal}
                className="rounded-xl p-1.5 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                &times;
              </button>
            </div>

            <div className="px-5 py-5">
              {errorMessage && (
                <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                  {errorMessage}
                </p>
              )}
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Rejection Reason
              </label>
              <textarea
                rows={4}
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="e.g. Application is incomplete. Please re-submit with a valid address and contact details."
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 border-t border-gray-100 px-5 py-4">
              <button
                onClick={closeRejectModal}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectModal.reason.trim()}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
