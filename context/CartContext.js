"use client";

import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (restaurant) => {
    const exstingItem = cart.find((item) => item.id === restaurant.id);

    if (exstingItem) {
      setCart(
        cart.map((item) =>
          item.id === restaurant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
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

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const totalCartPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );



  return (
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
