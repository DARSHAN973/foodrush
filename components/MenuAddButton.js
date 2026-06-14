"use client";

import { useTransition } from "react";
import Button from "@/components/Button";
import { addToCart } from "@/app/actions/cartActions";

export default function MenuAddButton({ menuItemId }) {
  const [isPending, startTransition] = useTransition();

  function handleAddToCart() {
    startTransition(async () => {
      await addToCart(menuItemId);
    });
  }

  return (
    <Button onClick={handleAddToCart} variant="primary" disabled={isPending}>
      {isPending ? "Adding..." : "Add"}
    </Button>
  );
}