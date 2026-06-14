"use client";

import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Button from "./Button";

export default function MenuClient({ menuItems }) {
  const { addToCart } = useContext(CartContext);
  return (
    <section id="menu" className="mt-10 scroll-mt-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Restaurant Menu
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Choose your meal</h2>
        </div>

        <p className="text-sm text-gray-500">
          {menuItems.length} items available
        </p>
      </div>

      {menuItems.length === 0 ? (
        <div className="mt-5 rounded-lg bg-white p-6 text-sm text-gray-600 shadow-sm">
          No menu items available right now.
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {menuItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.isVeg
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.isVeg ? "Veg" : "Non-veg"}
                      </span>

                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <span className="mt-4 text-lg font-bold text-gray-900">
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex w-28 shrink-0 flex-col items-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={160}
                    height={120}
                    className="h-24 w-28 rounded-xl object-cover"
                  />

                  <div className="-mt-4">
                    <Button onClick={() => addToCart(item)} variant="primary">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
