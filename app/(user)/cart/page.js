import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";
import { getCart } from "@/lib/cart";
import CartItemControls from "@/components/CartItemControls";
import { ArrowLeft, Shield, Store } from "lucide-react";

export default async function Cart() {
  // Server-rendered cart — reads the latest database state before rendering,
  // so cart actions can revalidate this page after mutations.
  const { items, totalItems, totalPrice } = await getCart();

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Your cart is empty"
            message="Add something tasty from the restaurants page."
          />

          <div className="mt-6 text-center">
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all"
            >
              <ArrowLeft size={18} />
              Browse Restaurants
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Group cart items by restaurant
  const itemsByRestaurant = items.reduce((groups, item) => {
    const restaurantId = item.menuItem.restaurant.id;
    if (!groups[restaurantId]) {
      groups[restaurantId] = {
        restaurant: item.menuItem.restaurant,
        items: [],
      };
    }
    groups[restaurantId].items.push(item);
    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/restaurants"
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:text-orange-600 hover:border-orange-200 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          Back to Restaurants
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your items before checkout.
            </p>
          </div>

          <Link
            href="/restaurants"
            className="w-fit rounded-xl border border-orange-500 px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50/50 active:scale-95 transition-all"
          >
            Continue shopping
          </Link>
        </div>

        {/* Responsive layout: stacks on mobile, splits into 2-columns on tablet (md:) and desktop (lg:) */}
        <div className="grid gap-6 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {Object.values(itemsByRestaurant).map(({ restaurant, items }) => (
              <div
                key={restaurant.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm space-y-4"
              >
                {/* Restaurant header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                      <Store size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                        {restaurant.name}
                      </h2>
                      <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5">
                        {restaurant.cuisine} • {restaurant.rating} ★ •{" "}
                        {restaurant.deliveryTime} mins
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] bg-orange-50 text-orange-600 font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    Split Order
                  </span>
                </div>

                {/* List of items */}
                <div className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 sm:gap-4 py-4 first:pt-0 last:pb-0 items-center"
                    >
                      {/* Thumbnail */}
                      <Image
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                          {item.menuItem.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Rs.{item.menuItem.price} each
                        </p>
                      </div>

                      {/* Controls & Subtotal */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
                        <CartItemControls
                          cartItemId={item.id}
                          quantity={item.quantity}
                        />
                        <div className="text-right min-w-[70px]">
                          <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
                            Subtotal
                          </p>
                          <p className="text-xs sm:text-sm font-black text-orange-600 mt-0.5">
                            Rs.{item.menuItem.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:sticky md:top-24 transition-all duration-300">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
              Order Summary
            </h2>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="font-bold text-gray-800">{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-green-600">Free</span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm sm:text-base font-black text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">Rs.{totalPrice}</span>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="mt-5 block w-full">
              <Button className="w-full rounded-xl py-3 font-bold shadow-lg shadow-orange-600/10 active:scale-95 transition-all">
                Proceed to Checkout
              </Button>
            </Link>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
              <Shield size={12} />
              <span>Secure Checkout powered by Razorpay</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
