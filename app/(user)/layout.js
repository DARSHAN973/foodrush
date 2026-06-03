import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/context/CartContext";

export default function UserLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}
