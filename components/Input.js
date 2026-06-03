// Controlled input component — the parent owns the value and onChange logic.
// This keeps the input reusable for search, login, forms, and admin fields.
function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
    />
  );
}

export default Input;