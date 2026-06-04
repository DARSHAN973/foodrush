"use client";

import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";

export default function Cart() {
  const {
    cart,
    cartCount,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalCartPrice,
    // Shared cart state — see context/CartContext.js.
  } = useContext(CartContext);

  if (cartCount === 0) {
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
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={320}
                    className="h-36 w-full rounded-lg object-cover sm:h-32 sm:w-40"
                  />

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        Rating {item.rating}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700">
                          Rs.{item.price}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                          {item.cuisine}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold text-gray-700 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => decreaseQty(item.id)}
                        >
                          -
                        </button>

                        <span className="min-w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold text-gray-700 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => increaseQty(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 text-right text-sm font-semibold text-gray-900">
                  Subtotal: Rs.{item.price * item.quantity}
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
                <span>{cartCount}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rs.{totalCartPrice}</span>
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

