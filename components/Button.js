// Reusable component — centralizes common button styling and behavior.
// Props customize each usage, and children becomes the button label/content.

export default function Button({
  // Default props — keep the button safe and convenient when a parent does not pass every option.
  // type defaults to "button" so it does not accidentally submit forms.
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  // Variant map — converts a simple variant prop into the correct Tailwind classes.
  // This keeps button style options organized without repeating if/else logic.
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
