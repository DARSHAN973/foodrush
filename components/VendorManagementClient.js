"use client";

import { useState, useTransition } from "react";
import {
  Store,
  UtensilsCrossed,
  ToggleLeft,
  ToggleRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";
import {
  toggleRestaurantOpen,
  updateRestaurantInfo,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from "@/app/actions/vendorActions";

// ─── Restaurant Info Tab ──────────────────────────────────────────────────────

function RestaurantInfoTab({ restaurant }) {
  const [isTogglePending, startToggleTransition] = useTransition();
  const [isFormPending, startFormTransition] = useTransition();
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  function handleToggle() {
    startToggleTransition(async () => {
      const result = await toggleRestaurantOpen();
      if (result?.error) alert(result.error);
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    const formData = new FormData(e.target);
    startFormTransition(async () => {
      const result = await updateRestaurantInfo(formData);
      if (result?.error) {
        setFormError(result.error);
      } else {
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 3000);
      }
    });
  }

  return (
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
          <button
            onClick={handleToggle}
            disabled={isTogglePending}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
              restaurant.isOpen
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {restaurant.isOpen ? (
              <ToggleRight size={20} className="text-green-500" />
            ) : (
              <ToggleLeft size={20} className="text-gray-400" />
            )}
            {isTogglePending
              ? "Saving..."
              : restaurant.isOpen
                ? "Open"
                : "Closed"}
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
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={restaurant.name}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Cuisine Type *
              </label>
              <input
                type="text"
                name="cuisine"
                defaultValue={restaurant.cuisine}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={restaurant.phone ?? ""}
                required
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                title="Enter a valid 10-digit phone number"
                placeholder="e.g. 9876543210"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={restaurant.address ?? ""}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={restaurant.description ?? ""}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition resize-none"
            />
          </div>
          {formError && (
            <p className="text-sm text-red-600 font-medium">{formError}</p>
          )}
          {formSuccess && (
            <p className="text-sm text-green-600 font-medium">Changes saved!</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isFormPending}
              className="rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Menu Item Row ────────────────────────────────────────────────────────────

// MenuItemRow — renders one item row with inline edit form.
// imageUrl/imagePublicId are stored in local state and passed as hidden inputs
// to updateMenuItem — same pattern as AdminMenuItemsClient.
function MenuItemRow({ item, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isTogglePending, startToggleTransition] = useTransition();
  const [isEditPending, startEditTransition] = useTransition();
  const [editError, setEditError] = useState(null);
  const [imageUrl, setImageUrl] = useState(item.imageUrl || "");
  const [imagePublicId, setImagePublicId] = useState(item.imagePublicId || "");

  function handleToggle() {
    startToggleTransition(async () => {
      const result = await toggleMenuItemAvailability(item.id);
      if (result?.error) alert(result.error);
    });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    setEditError(null);
    const formData = new FormData(e.target);
    startEditTransition(async () => {
      const result = await updateMenuItem(item.id, formData);
      if (result?.error) {
        setEditError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  return (
    <div className="border-b border-gray-50 last:border-0">
      {/* Item header row */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Item thumbnail — shows image if available, else veg/non-veg dot */}
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-base">{item.isVeg ? "🟢" : "🔴"}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {item.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              ₹{item.price} · {item.category} ·{" "}
              <span className={item.isVeg ? "text-green-600" : "text-red-500"}>
                {item.isVeg ? "Veg" : "Non-Veg"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Available toggle */}
          <button
            onClick={handleToggle}
            disabled={isTogglePending}
            className={`rounded-full border px-3 py-1 text-[11px] font-bold transition disabled:opacity-50 ${
              item.isAvailable
                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {isTogglePending
              ? "..."
              : item.isAvailable
                ? "Available"
                : "Unavailable"}
          </button>

          {/* Edit toggle */}
          <button
            onClick={() => setIsEditing((p) => !p)}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-orange-200 hover:text-orange-600 transition"
          >
            {isEditing ? <ChevronUp size={14} /> : <Pencil size={14} />}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:text-red-600 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Inline edit form — only renders when isEditing is true */}
      {isEditing && (
        <form
          onSubmit={handleEditSubmit}
          className="px-4 sm:px-6 pb-4 bg-gray-50/50 border-t border-gray-100"
        >
          <div className="pt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={item.name}
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Category *
              </label>
              <input
                type="text"
                name="category"
                defaultValue={item.category}
                required
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                defaultValue={item.price}
                required
                min="1"
                step="0.01"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Type
              </label>
              <select
                name="isVeg"
                defaultValue={item.isVeg ? "true" : "false"}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              >
                <option value="true">Veg</option>
                <option value="false">Non-Veg</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Item Image
              </label>
              {/* ImageUpload — uploads to Cloudinary immediately on file select.
                  onUploadSuccess stores url+publicId in local state → hidden inputs
                  carry them into the FormData on submit. See ImageUpload.js. */}
              <ImageUpload
                defaultImageUrl={imageUrl}
                onUploadSuccess={(url, publicId) => {
                  setImageUrl(url);
                  setImagePublicId(publicId);
                }}
              />
              <input type="hidden" name="imageUrl" value={imageUrl} />
              <input type="hidden" name="imagePublicId" value={imagePublicId} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                defaultValue={item.description ?? ""}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>
          </div>
          {editError && (
            <p className="mt-2 text-xs text-red-600 font-medium">{editError}</p>
          )}
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              <X size={12} /> Cancel
            </button>
            <button
              type="submit"
              disabled={isEditPending}
              className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition disabled:opacity-50"
            >
              <Check size={12} />
              {isEditPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Add Item Form ────────────────────────────────────────────────────────────

function AddItemForm({ onClose }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  // imageUrl/imagePublicId state — updated by ImageUpload, passed to addMenuItem via hidden inputs
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    startTransition(async () => {
      const result = await addMenuItem(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/30 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">Add New Item</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Paneer Butter Masala"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Category *
            </label>
            <input
              type="text"
              name="category"
              required
              placeholder="e.g. Main Course"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              required
              min="1"
              step="0.01"
              placeholder="e.g. 280"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Type
            </label>
            <select
              name="isVeg"
              defaultValue="true"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            >
              <option value="true">Veg</option>
              <option value="false">Non-Veg</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Optional short description"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Item Image
            </label>
            <ImageUpload
              defaultImageUrl={imageUrl}
              onUploadSuccess={(url, publicId) => {
                setImageUrl(url);
                setImagePublicId(publicId);
              }}
            />
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <input type="hidden" name="imagePublicId" value={imagePublicId} />
          </div>
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 transition disabled:opacity-50"
          >
            <Plus size={12} />
            {isPending ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Menu Items Tab ───────────────────────────────────────────────────────────

function MenuItemsTab({ menuItems }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  // handleDelete — shows a browser confirm dialog before calling the server action.
  // deletingId tracks which item is being deleted so we can show spinner on that row.
  function handleDelete(itemId) {
    if (
      !confirm(
        "Are you sure you want to delete this item? This cannot be undone.",
      )
    )
      return;
    setDeletingId(itemId);
    startDeleteTransition(async () => {
      const result = await deleteMenuItem(itemId);
      if (result?.error) alert(result.error);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">
      {/* Add button or form */}
      {showAddForm ? (
        <AddItemForm onClose={() => setShowAddForm(false)} />
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      )}

      {/* Menu Items list */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {menuItems.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">
            No menu items yet. Add your first item!
          </p>
        ) : (
          menuItems.map((item) => (
            <MenuItemRow key={item.id} item={item} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function VendorManagementClient({ restaurant }) {
  const [activeTab, setActiveTab] = useState("info");

  function tabClass(tab) {
    return `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer ${
      activeTab === tab
        ? "bg-orange-600 text-white shadow-md"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
    }`;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Management
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Edit your restaurant details and manage your menu.
        </p>
      </div>

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

      {activeTab === "info" && <RestaurantInfoTab restaurant={restaurant} />}
      {activeTab === "menu" && (
        <MenuItemsTab menuItems={restaurant.menuItems} />
      )}
    </div>
  );
}
