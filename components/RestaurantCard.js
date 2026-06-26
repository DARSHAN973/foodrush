"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import Button from "./Button";
import { useRouter } from "next/navigation";

function RestaurantCard({ restaurant }) {
  const router = useRouter();

  const viewMenu = () => {
    router.push(`/restaurants/${restaurant.id}#menu`);
  };

  return (
    <>
      {/* --- MOBILE LAYOUT (Clickable card, no buttons, compact aspect-ratio, visible only on mobile) --- */}
      <Link
        href={`/restaurants/${restaurant.id}`}
        className="group block sm:hidden h-full select-none"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          {/* Image Container with Badge */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Cuisine Badge overlay */}
            <span className="absolute left-3 top-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white tracking-wide">
              {restaurant.cuisine}
            </span>
          </div>

          {/* Card Details */}
          <div className="flex flex-1 flex-col p-3">
            <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
              {restaurant.name}
            </h3>

            <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50 text-[10px]">
              {/* Rating */}
              <div className="flex items-center gap-0.5 font-bold text-gray-700">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{restaurant.rating}</span>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center gap-0.5 text-gray-500 font-semibold">
                <Clock size={12} />
                <span>{restaurant.deliveryTime}m</span>
              </div>
            </div>
          </div>
        </article>
      </Link>

      {/* --- DESKTOP LAYOUT (Original layout with buttons, visible only from sm breakpoint up) --- */}
      <article className="hidden sm:flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <Image
          src={restaurant.imageUrl}
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
                {restaurant.deliveryTime} mins
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

          <Button onClick={viewMenu} variant="secondary">
            View Menu
          </Button>
        </div>
      </article>
    </>
  );
}

export default RestaurantCard;
