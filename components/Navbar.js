import { getCartCount } from "@/lib/cart";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const cartCount = await getCartCount();

  return  <NavbarClient cartCount={cartCount} />;
  
}