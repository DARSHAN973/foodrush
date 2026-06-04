"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import Button from "@/components/Button";

export default function AddToCartButton({ restaurant }) {
  // useContext consumer — reads the shared cart action directly
  // from CartContext instead of receiving it through prop drilling.
  const { addToCart } = useContext(CartContext);
  const router = useRouter();
  // Event handler — pass a function reference so React runs this
  // add-to-cart and navigation flow only after the button click.
  function handleAddToCart() {
    addToCart(restaurant);
    router.push("/cart");
  }

  return <Button onClick={handleAddToCart}>Add To Cart</Button>;
}
