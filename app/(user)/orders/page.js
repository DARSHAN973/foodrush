import { redirect } from "next/navigation";

export default function OrdersRedirectPage() {
  // Graceful redirect — since order history is now unified inside the profile dashboard,
  // we redirect any traffic heading to /orders to /profile?tab=orders.
  redirect("/profile?tab=orders");
}
