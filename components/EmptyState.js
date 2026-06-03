// Reusable display component — keeps empty states visually consistent.
// Props let each page provide the correct title and optional message.
export default function EmptyState({ title, message }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      {message && (
        // Conditional rendering — only show the message paragraph when a message prop exists.
        <p className="mt-2 max-w-md text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
