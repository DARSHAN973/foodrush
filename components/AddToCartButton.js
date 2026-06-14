"use client";

import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions/cartActions";
import Button from "@/components/Button";

export default function AddToCartButton({ menuItem }) {
  // useContext consumer — reads the shared cart action directly
  // from CartContext instead of receiving it through prop drilling.

  // App Router navigation hook — useRouter from next/navigation replaces
  // React Router navigation for client-side route changes in Next.js.
  const router = useRouter();

  // Event handler — pass a function reference so React runs this
  // add-to-cart and navigation flow only after the button click.
  async function handleAddToCart() {
    await addToCart(menuItem.id);
    router.push("/cart");
  }

  return <Button onClick={handleAddToCart}>Add To Cart</Button>;
}
