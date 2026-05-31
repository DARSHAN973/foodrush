export default function Button({ children, onClick, type = "button", variant = "primary", className = ""}) {
  const variantClass = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md px-4 py-2 font-medium transition ${variantClass[variant]} ${className}`}
    >
      {children}
    </button>
  );
}


