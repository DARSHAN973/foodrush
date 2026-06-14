import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRestaurants, getRestaurant } from "@/lib/restaurants";
import MenuClient from "@/components/MenuClient";

// generateStaticParams — tells Next.js which dynamic routes to pre-build
// at build time. This is SSG for known restaurant detail pages.
export async function generateStaticParams() {
  const restaurants = await getRestaurants();

  // Each returned id becomes one pre-built route, like /restaurants/1.
  return restaurants.slice(0, 10).map((restaurant) => ({
    // Dynamic route params must be strings.
    id: String(restaurant.id),
  }));
}

// generateMetadata — builds page-specific SEO data on the server.
// Dynamic routes can use params so each restaurant gets its own title/description.
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const restaurant = await getRestaurant(id);

    if (restaurant === null) {
      return {
        title: "Restaurant | FoodRush",
        description: "View restaurant details on FoodRush",
      };
    }

    return {
      title: `${restaurant.name} | FoodRush`,
      description: `Order from ${restaurant.name} on FoodRush`,
    };
  } catch {
    return {
      title: "Restaurant | FoodRush",
      description: "View restaurant details on FoodRush",
    };
  }
}

// Dynamic route params — [id] in the folder name becomes params.id,
// so one page component can render different restaurant detail pages.
export default async function RestaurantDetails({ params }) {
  // params contains the dynamic URL values for this route, like /restaurants/5.
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  // notFound() belongs in the page, not the shared helper.
  // The helper returns null for missing data; the page decides to show not-found.js.
  if (restaurant === null) {
    notFound();
  }

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
            src={restaurant.imageUrl}
            alt={restaurant.name}
            width={700}
            height={460}
            className="h-80 w-full rounded-lg object-cover"
          />

          <div className="flex flex-col justify-between">
            <div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                {restaurant.cuisine}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                Browse fresh menu items from this restaurant and add your
                favorites to your FoodRush cart.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-gray-500">Rating</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {restaurant.rating}
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-gray-500">Delivery Time</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {restaurant.deliveryTime} mins
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-gray-500">Menu Items</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {restaurant.menuItems.length}
                  </p>
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <p className="text-gray-500">Status</p>
                  <p className="mt-1 font-semibold text-green-700">
                    Accepting orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MenuClient menuItems={restaurant.menuItems} />
      </div>
    </main>
  );
}
