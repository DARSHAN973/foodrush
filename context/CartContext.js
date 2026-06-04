"use client";

import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  // Cart state — React must own the cart because add/remove/quantity
  // changes should immediately re-render every component using it.
  const [cart, setCart] = useState(() => {
    // Lazy state initializer — read localStorage only once when cart state starts.
    // The window check avoids accessing browser storage during server rendering.
    if (typeof window === "undefined") {
      return [];
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });
  // Toast state — an empty string means no toast; setting a message
  // makes the shared Toast component appear until it is cleared.
  const [toastMessage, setToastMessage] = useState("");
  // useEffect side effect — keep localStorage in sync after cart changes.
  // The dependency array prevents saving on unrelated re-renders.
  useEffect(() => {
    // localStorage serialization — browser storage only stores strings,
    // so stringify when saving and parse when restoring the cart array.
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (restaurant) => {
    // find — checks whether this restaurant is already in the cart.
    // If it exists, we update quantity instead of adding a duplicate item.
    const existingItem = cart.find((item) => item.id === restaurant.id);

    if (existingItem) {
      setCart(
        // Immutable update with map — build a new cart array and replace
        // only the matching item with a copied object plus updated quantity.
        cart.map((item) =>
          item.id === restaurant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      // Immutable add with spread — keep existing cart items and append
      // the new restaurant as a cart item with quantity and price.
      setCart([
        ...cart,
        {
          ...restaurant,
          quantity: 1,
          price: Math.floor(restaurant.rating * 100),
        },
      ]);
    }
    setToastMessage(`${restaurant.name} added to cart`);
  };
  // Effect cleanup — clear the previous toast timer before starting
  // a new one, so old timers do not clear newer toast messages.
  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timerId = setTimeout(() => {
      setToastMessage("");
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [toastMessage]);

  // Items remove with filter — create a new cart without
  // the item whose id matches the removed restaurant.
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  // Derived cart count — sum item quantities because cart.length
  // only counts unique restaurants, not total selected quantity.
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  // Immutable quantity update — replace only the matching cart item
  // with a copied object whose quantity is increased.
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };
  // Decrease then clean up — map lowers the matching quantity,
  // filter removes the item once quantity reaches zero.
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  // Derived total price via reduce — same reduce pattern as cartCount,
  // but each item's contribution is price multiplied by quantity.
  const totalCartPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    // Context Provider — keeps cart state and cart actions in one shared place.
    // Any component inside CartProvider can use the same cart data without prop drilling.
    // Shared cart state — one provider owns the cart, so updates from
    // AddToCartButton stay in sync with Navbar, Cart page, and Toast.
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        cartCount,
        removeFromCart,
        increaseQty,
        decreaseQty,
        totalCartPrice,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
