import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Toast() {
  // Shared cart state — see context/CartContext.js.
  const { toastMessage } = useContext(CartContext);

  if (!toastMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
      {toastMessage}
    </div>
  );
}

export default Toast;
