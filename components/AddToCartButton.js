"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import Button from "@/components/Button";

export default function AddToCartButton({ restaurant }) {
  const { addToCart } = useContext(CartContext);
  const router = useRouter();

  function handleAddToCart() {
    addToCart(restaurant);
    router.push("/cart");
  }

  return <Button onClick={handleAddToCart}>Add To Cart</Button>;
}
