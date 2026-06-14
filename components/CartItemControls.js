"use client";

import {
  decreaseCartItem,
  increaseCartItem,
  removeCartItem,
} from "@/app/actions/cartActions";
import { useState } from "react";

export default function CartItemControls({ cartItemId, quantity }) {
  // Pending action state — track the exact clicked button so one cart row does
  // not show loading text on every control at the same time.
  const [pendingAction, setPendingAction] = useState(null);

  async function handleDecrease() {
    setPendingAction("decrease");

    await decreaseCartItem(cartItemId);

    setPendingAction(null);
  }

  async function handleIncrease() {
    setPendingAction("increase");
    await increaseCartItem(cartItemId);
    setPendingAction(null);
  }

  async function handleRemove() {
    setPendingAction("remove");
    await removeCartItem(cartItemId);
    setPendingAction(null);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold text-gray-700 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
          onClick={handleDecrease}
          disabled={pendingAction !== null}
        >
          {pendingAction === "decrease" ? "..." : "-"}
        </button>

        <span className="min-w-8 text-center font-semibold">{quantity}</span>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold text-gray-700 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
          onClick={handleIncrease}
          disabled={pendingAction !== null}
        >
          {pendingAction === "increase" ? "..." : "+"}
        </button>
      </div>

      <button
        className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        onClick={handleRemove}
        disabled={pendingAction !== null}
      >
        {pendingAction === "remove" ? "Removing" : "remove"}
      </button>
    </div>
  );
}
