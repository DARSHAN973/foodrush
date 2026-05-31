import Loading from "@/components/Loading";

export default function RestaurantsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <Loading message="Loading restaurants..." />
    </main>
  );
}
