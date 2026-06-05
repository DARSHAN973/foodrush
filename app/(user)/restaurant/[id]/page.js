import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

// generateStaticParams — tells Next.js which dynamic routes to pre-build
// at build time. This is SSG for known restaurant detail pages.
export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/recipes?limit=10");

  const data = await response.json();

  // Each returned id becomes one pre-built route, like /restaurant/1.
  return data.recipes.map((restaurant) => ({
    // Dynamic route params must be strings.
    id: String(restaurant.id),
  }));
}

// Server fetching in page.js — this runs before the page HTML is sent,
// so the route can render with restaurant data already available.
async function getRestaurant(id) {
  const response = await fetch(`https://dummyjson.com/recipes/${id}`);

  // notFound() — stops rendering this page and shows the nearest not-found.js
  // when the requested restaurant does not exist.
  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant details");
  }

  return response.json();
}

// generateMetadata — builds page-specific SEO data on the server.
// Dynamic routes can use params so each restaurant gets its own title/description.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  return {
    title: `${restaurant.name} | FoodRush`,
    description: `Order from ${restaurant.name} on FoodRush`,
  };
}

// Dynamic route params — [id] in the folder name becomes params.id,
// so one page component can render different restaurant detail pages.
export default async function RestaurantDetails({ params }) {
  // params contains the dynamic URL values for this route, like /restaurant/5.
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/restaurants"
          className="mb-6 inline-block rounded-md border border-orange-600 px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
        >
          Back to restaurants
        </Link>

        <section className="grid gap-8 rounded-lg bg-white p-6 shadow-sm lg:grid-cols-2">
          {/* Next Image — optimizes image loading, but remote image URLs must be
              allowed in next.config.js before Next.js can render them. */}
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            width={400}
            height={320}
            className="h-80 w-full rounded-lg object-cover"
          />

          <div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
              {restaurant.cuisine}
            </span>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              {restaurant.name}
            </h1>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-gray-500">Rating</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.rating}
                </p>
              </div>

              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-gray-500">Cook Time</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.cookTimeMinutes} mins
                </p>
              </div>

              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-gray-500">Prep</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.prepTimeMinutes} mins
                </p>
              </div>

              <div className="rounded-md bg-gray-50 p-3">
                <p className="text-gray-500">Serves</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.servings}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {restaurant.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <AddToCartButton restaurant={restaurant} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
              {restaurant.ingredients?.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Instructions
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-600">
              {restaurant.instructions?.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
