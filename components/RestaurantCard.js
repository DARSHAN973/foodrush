"use client";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Link from "next/link";
import Button from "./Button";
import Image from "next/image";

function RestaurantCard({ restaurant }) {
  const { addToCart } = useContext(CartContext);
  return (
    <article className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Image
        src={restaurant.image}
        alt={restaurant.name}
        width={400}
        height={320}
        className="mb-4 h-80 w-full rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col items-center text-center">
        <h3 className="text-lg font-semibold leading-snug text-gray-900">
          {restaurant.name}
        </h3>

        <span className="mt-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
          {restaurant.cuisine}
        </span>

        <div className="mt-4 grid w-full grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Rating</p>
            <p className="font-semibold text-gray-900">{restaurant.rating}</p>
          </div>

          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Delivery</p>
            <p className="font-semibold text-gray-900">
              {restaurant.cookTimeMinutes} mins
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <Link
          className="rounded-md border border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
          href={`/restaurants/${restaurant.id}`}
        >
          View Details
        </Link>

        <Button onClick={() => addToCart(restaurant)} variant="secondary">
          Order Now
        </Button>
      </div>
    </article>
  );
}

export default RestaurantCard;
