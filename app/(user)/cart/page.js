import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";
import { getCart } from "@/lib/cart";
import CartItemControls from "@/components/CartItemControls";

export default async function Cart() {
  const { items, totalItems, totalPrice } = await getCart();

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Your cart is empty"
            message="Add something tasty from the restaurants page."
          />

          <div className="mt-6 text-center">
            <Link
              href="/restaurants"
              className="inline-block rounded-md bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8 ">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/restaurants"
          className="mb-6 inline-block rounded-md border border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
        >
          Back to restaurants
        </Link>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="mt-1 text-gray-600">
              Review your items before checkout.
            </p>
          </div>

          <Link
            href="/restaurants"
            className="rounded-md border border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
          >
            Continue shopping
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Image
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    width={400}
                    height={320}
                    className="h-36 w-full rounded-lg object-cover sm:h-32 sm:w-40"
                  />

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.menuItem.name}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700">
                          Rs.{Number(item.menuItem.price)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                          {item.menuItem.restaurant.cuisine}
                        </span>
                      </div>
                    </div>

                    <CartItemControls
                      cartItemId={item.id}
                      quantity={item.quantity}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 text-right text-sm font-semibold text-gray-900">
                  Subtotal: Rs.{Number(item.menuItem.price) * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rs.{totalPrice}</span>
                </div>
              </div>
            </div>

            <Button className="mt-5 w-full">Proceed to Checkout</Button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Checkout and payment will be connected in the backend phase.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
