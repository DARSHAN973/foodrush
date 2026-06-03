import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/context/CartContext";

//Route group layout - wraps only the user-facing pages.
//<html> and <body> stays in app/layout.js because only root layout creates the document shell.
export default function UserLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
    </CartProvider>
  );
}
