import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Restaurant not found
      </h1>

      <p className="mt-3 text-gray-600">
        This restaurant is not available on FoodRush.
      </p>

      <Link
        href="/restaurants"
        className="mt-6 inline-block rounded-md bg-orange-600 px-4 py-2 font-semibold text-white"
      >
        Browse restaurants
      </Link>
    </main>
  );
}
