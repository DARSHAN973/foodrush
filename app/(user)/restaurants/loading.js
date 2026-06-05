import Loading from "@/components/Loading";
// Route-level loading.js — Next.js automatically shows this UI while
// this route segment is waiting for its Server Component data.
export default function RestaurantsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <Loading message="Loading restaurants..." />
    </main>
  );
}
