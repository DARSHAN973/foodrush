export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-600">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

