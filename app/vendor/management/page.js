"use client";

// Client Component — tabs require local state to track which tab is active.
// This page will also handle form submissions for restaurant info edits
// and menu item CRUD once real server actions are wired up.

import { useState } from "react";
import {
  Store,
  UtensilsCrossed,
  ToggleLeft,
  ToggleRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

// --- Hardcoded placeholder data ---
// Restaurant info — will come from DB via getVendorRestaurant(session.user.id)
const RESTAURANT = {
  name: "Spice Garden",
  cuisine: "North Indian",
  address: "12, MG Road, Bengaluru",
  phone: "+91 98765 43210",
  description: "Authentic North Indian flavours with a modern twist.",
  isOpen: true,
};

// Menu items — will come from DB via getMenuItemsByRestaurant(restaurantId)
const INITIAL_MENU_ITEMS = [
  { id: 1, name: "Paneer Butter Masala", price: 280, isAvailable: true },
  { id: 2, name: "Garlic Naan", price: 50, isAvailable: true },
  { id: 3, name: "Dal Tadka", price: 180, isAvailable: true },
  { id: 4, name: "Jeera Rice", price: 120, isAvailable: true },
  { id: 5, name: "Mango Lassi", price: 90, isAvailable: false },
  { id: 6, name: "Gulab Jamun", price: 80, isAvailable: true },
];

export default function VendorManagement() {
  // activeTab — controls which tab panel is shown. "info" or "menu".
  const [activeTab, setActiveTab] = useState("info");

  // menuItems — local copy of items so toggle changes reflect instantly
  // before real server actions are connected.
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);

  // isOpen — local toggle state for restaurant open/closed.
  const [isOpen, setIsOpen] = useState(RESTAURANT.isOpen);

  // handleToggleAvailability — flips the isAvailable flag for one menu item.
  function handleToggleAvailability(itemId) {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );
  }

  // Shared tab button class helper — same pattern as admin/components tab switchers.
  function tabClass(tab) {
    return `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
      activeTab === tab
        ? "bg-orange-600 text-white shadow-md"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
    }`;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Management
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Edit your restaurant details and manage your menu.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab("info")}
          className={tabClass("info")}
        >
          <Store size={16} />
          <span className="whitespace-nowrap">Restaurant Info</span>
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={tabClass("menu")}
        >
          <UtensilsCrossed size={16} />
          <span className="whitespace-nowrap">Menu Items</span>
        </button>
      </div>

      {/* ── TAB 1: Restaurant Info ── */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Open/Closed Toggle Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Restaurant Status
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Toggle whether customers can currently place orders.
                </p>
              </div>

              {/* Toggle button — flips isOpen state */}
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                  isOpen
                    ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isOpen ? (
                  <ToggleRight size={20} className="text-green-500" />
                ) : (
                  <ToggleLeft size={20} className="text-gray-400" />
                )}
                {isOpen ? "Open" : "Closed"}
              </button>
            </div>
          </div>

          {/* Restaurant Info Form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Restaurant Details
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Update your public-facing restaurant information.
            </p>

            {/* Form fields — pre-filled with current data.
                onSubmit will call a server action (updateRestaurantInfo) later. */}
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    defaultValue={RESTAURANT.name}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Cuisine Type
                  </label>
                  <input
                    type="text"
                    defaultValue={RESTAURANT.cuisine}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue={RESTAURANT.phone}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue={RESTAURANT.address}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Description
                </label>
                <textarea
                  defaultValue={RESTAURANT.description}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 2: Menu Items ── */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          {/* Add New Item button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition">
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {/* Menu Items list */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4"
              >
                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">₹{item.price}</p>
                </div>

                {/* Available toggle pill */}
                <button
                  onClick={() => handleToggleAvailability(item.id)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold transition ${
                    item.isAvailable
                      ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </button>

                {/* Edit + Delete action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-orange-200 hover:text-orange-600 transition">
                    <Pencil size={14} />
                  </button>
                  <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:text-red-600 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
