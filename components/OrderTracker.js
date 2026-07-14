"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChefHat,
  Bike,
  Package,
  XCircle,
  Loader2,
  Check,
  Store,
  ShieldCheck,
} from "lucide-react";

// RestaurantOrder moves through 5 stages independently per restaurant.
// These match RestaurantOrderStatus in the Prisma schema — NOT ParentOrderStatus.
// The vendor updates RestaurantOrder.status in /vendor/orders.
const STEPS = [
  {
    key: "PLACED",
    label: "Order Placed",
    icon: Package,
    description: "Waiting for restaurant to confirm.",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    icon: ShieldCheck,
    description: "Restaurant confirmed your order.",
  },
  {
    key: "PREPARING",
    label: "Preparing",
    icon: ChefHat,
    description: "The kitchen is cooking your food fresh.",
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: Bike,
    description: "Your delivery partner is on the way!",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle2,
    description: "Enjoy your meal! 🎉",
  },
];

// Maps DB status string → step index (0-based) for stepper positioning.
const STATUS_INDEX = {
  PLACED: 0,
  CONFIRMED: 1,
  PREPARING: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

// RestaurantStepper — renders the 5-step progress bar for one restaurant sub-order.
// Extracted as a separate component so OrderTracker can render one per restaurant.
function RestaurantStepper({ restaurant }) {
  const { name, status } = restaurant;

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 py-3 text-red-600">
        <XCircle size={20} className="shrink-0" />
        <div>
          <p className="font-bold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-red-500 mt-0.5">
            This sub-order was cancelled.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[status] ?? 0;
  const progressPercent =
    STEPS.length > 1 ? (currentIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Restaurant label */}
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
        <Store size={15} className="text-orange-600" />
        {name}
      </div>

      <div className="relative pl-2">
        {/* Static grey background line — full height, always visible */}
        <div className="absolute left-[27px] top-5 bottom-5 w-0.5 bg-gray-200 rounded-full" />

        {/* Orange progress line — grows as status advances */}
        <div
          className="absolute left-[27px] top-5 w-0.5 bg-orange-500 rounded-full transition-all duration-700 ease-in-out"
          style={{ height: `calc(${progressPercent}% * (100% - 40px) / 100)` }}
        />

        <div className="space-y-6">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="relative flex items-start gap-4">
                {/* Step circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isCompleted
                      ? "bg-orange-600 border-orange-600"
                      : isActive
                        ? "bg-white border-orange-500 shadow-lg shadow-orange-100"
                        : "bg-white border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <Icon
                      size={16}
                      className={isActive ? "text-orange-600" : "text-gray-300"}
                    />
                  )}
                  {/* Pulse ring — only on the active step to signal live tracking */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-60" />
                  )}
                </div>

                {/* Step label + description */}
                <div className="pt-1.5 min-h-[40px]">
                  <p
                    className={`text-sm font-bold transition-colors duration-300 ${
                      isCompleted || isActive
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-orange-600 font-medium mt-0.5">
                      {step.description}
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      ✓ Done
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function OrderTracker({ orderId, initialRestaurants }) {
  // restaurants — array of { id, name, status } for each sub-order.
  // Initialized from server-fetched data so the page never starts blank.
  const [restaurants, setRestaurants] = useState(initialRestaurants);

  // connected — whether the EventSource connection is currently active.
  const [connected, setConnected] = useState(false);

  // useEffect — runs after mount. EventSource is browser-only (no window during SSR),
  // so it must live inside useEffect, not at the top level of the component.
  useEffect(() => {
    // EventSource — browser's built-in SSE client.
    // Opens a persistent GET connection to our stream route.
    // Auto-reconnects if the network drops temporarily.
    const es = new EventSource(`/api/orders/${orderId}/stream`);

    es.onopen = () => setConnected(true);

    // onmessage — fires every time the server pushes a "data: ..." chunk.
    // event.data is the raw string, we JSON.parse it to get our snapshot object.
    es.onmessage = (event) => {
      const { parentStatus, restaurants: newRestaurants } = JSON.parse(
        event.data,
      );
      setRestaurants(newRestaurants);

      // Close when ParentOrder reaches a terminal state — no more updates expected.
      if (parentStatus === "COMPLETED" || parentStatus === "CANCELLED") {
        es.close();
        setConnected(false);
      }
    };

    es.onerror = () => setConnected(false);

    // Cleanup — closes the EventSource when the component unmounts.
    // Without this, the connection stays open and the server keeps polling the DB.
    return () => es.close();
  }, [orderId]);

  return (
    <div className="space-y-6">
      {/* Live connection indicator */}
      <div className="flex items-center gap-2">
        {connected ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-green-700">
              Live tracking
            </span>
          </>
        ) : (
          <>
            <Loader2 size={12} className="text-gray-400 animate-spin" />
            <span className="text-xs font-semibold text-gray-400">
              Connecting...
            </span>
          </>
        )}
      </div>

      {/* One stepper per restaurant sub-order */}
      <div className="space-y-10">
        {restaurants.map((restaurant, i) => (
          <div
            key={restaurant.id}
            className={i > 0 ? "pt-8 border-t border-gray-100" : ""}
          >
            <RestaurantStepper restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
}
