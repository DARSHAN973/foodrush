"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "./Button";
import Input from "./Input";
import ErrorMessage from "./ErrorMessage";
import { placeOrder, verifyPayment } from "@/app/actions/orderActions";

// loadRazorpayScript — Razorpay is NOT installed via npm. Instead, it provides
// a hosted JS file that injects window.Razorpay into the browser at runtime.
// We create a <script> tag dynamically so it only loads when the user
// actually reaches the payment step, not on every page load.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    // Resolve true when the script loads — false if CDN is unreachable.
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutForm({ cart }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // showToast — controls the 3-second success popup shown after payment is verified.
  const [showToast, setShowToast] = useState(false);

  // Calculate pricing breakdown
  const subtotal = cart.totalPrice;
  // Free delivery on orders above Rs. 500
  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const platformFee = 5;
  const grandTotal = subtotal + deliveryFee + platformFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Remove any character that is NOT a number
      const numbersOnly = value.replace(/\D/g, "");

      // Limit to 10 digits
      if (numbersOnly.length > 10) return;

      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear field-specific error once user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side validations
    const validationErrors = {};
    if (!formData.address.trim()) {
      validationErrors.address = "Please enter your delivery address";
    } else if (formData.address.trim().length < 10) {
      validationErrors.address =
        "Please provide a complete address (min. 10 chars)";
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = "Please enter your phone number";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      validationErrors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the server action with the address and phone number
      const result = await placeOrder({
        address: formData.address,
        phone: formData.phone,
      });

      if (result?.error) {
        // If the server returns an error, set it in the error state
        setErrors({ general: result.error });
      } else {
        // Load the Razorpay browser script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setErrors({ general: "Failed to load payment gateway. Try again." });
          return;
        }

        // Razorpay popup options — these configure what the payment modal shows.
        // key: public key from env (NEXT_PUBLIC_ prefix required for browser access).
        // amount: in paise, already converted by the server action.
        // order_id: the Razorpay order id returned by placeOrder — this links
        //           our popup to the pre-created Razorpay order on their server.
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: result.amount,
          currency: "INR",
          name: "FoodRush",
          description: "Food Order Payment",
          order_id: result.razorpayOrderId,
          handler: async function (response) {
            const verifyResult = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              parentOrderId: result.parentOrderId,
            });
            if (verifyResult?.error) {
              setErrors({ general: verifyResult.error });
            } else {
              // Show the success toast for 3 seconds then navigate to home.
              // We navigate away instead of using setOrderSuccess because revalidatePath
              // causes the checkout server component to re-run, sees an empty cart,
              // and its redirect guard fires before React can render the success screen.
              setShowToast(true);
              setTimeout(() => router.push("/"), 3000);
            }
          },
          prefill: {
            contact: formData.phone,
          },
          theme: { color: "#f97316" }, // FoodRush orange
        };

        // new window.Razorpay(options) — instantiates the modal using the CDN-injected
        // class. We call .open() to display it to the user.
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showToast) {
    return (
      <>
        {/* Full-screen dimmed backdrop */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Toast card */}
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-10 py-8 shadow-2xl animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✅
            </div>
            <p className="text-xl font-bold text-gray-900">
              Order Placed Successfully!
            </p>
            <p className="text-sm text-gray-500">Redirecting you to home...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Left Column: Delivery Form */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Delivery Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-650 border border-red-150">
              {errors.general}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <textarea
              name="address"
              rows="4"
              placeholder="Flat/House No, Building, Street Name, Landmark, Area, City, Pincode"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
            <ErrorMessage message={errors.address} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <Input
              type="tel"
              name="phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
            <ErrorMessage message={errors.phone} />
            <p className="mt-1 text-xs text-gray-400">
              For updates on your delivery.
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-base font-bold shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Preparing Checkout..." : "Confirm & Place Order"}
            </Button>
          </div>
        </form>
      </section>

      {/* Right Column: Checkout Items Summary */}
      <aside className="space-y-6">
        {/* Items Card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Items Summary
          </h2>

          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 text-sm">
                {item.menuItem.imageUrl && (
                  <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {item.menuItem.name}
                  </h4>
                  <p className="text-gray-500">
                    Qty: {item.quantity} × Rs.{Number(item.menuItem.price)}
                  </p>
                </div>
                <div className="font-semibold text-gray-900 text-right">
                  Rs.{Number(item.menuItem.price) * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Summary Card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Payment Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">Rs.{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="font-semibold text-green-600">FREE</span>
              ) : (
                <span className="font-medium text-gray-900">
                  Rs.{deliveryFee}
                </span>
              )}
            </div>

            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span className="font-medium text-gray-900">
                Rs.{platformFee}
              </span>
            </div>

            {deliveryFee > 0 && (
              <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-md">
                💡 Add Rs.{500 - subtotal} more to unlock <b>FREE Delivery</b>!
              </p>
            )}

            <div className="border-t border-gray-150 pt-3">
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-orange-600">Rs.{grandTotal}</span>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
