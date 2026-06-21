import { getCart } from "@/lib/cart";
import { redirect } from "next/navigation";
import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout | FoodRush",
  description:
    "Review your order and provide delivery details to complete your purchase on FoodRush.",
};

export default async function CheckoutPage() {
  // Fetch cart data on the server for instant rendering
  const cart = await getCart();

  // Guard: if user has no items in the cart, prevent them from accessing checkout
  if (!cart || cart.totalItems === 0) {
    redirect("/cart");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-750 transition"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Cart
        </Link>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          Checkout
        </h1>

        {/* Delegate interaction to CheckoutForm Client Component */}
        <CheckoutForm cart={cart} />
      </div>
    </main>
  );
}
