import Link from "next/link";
import RestaurantCard from "../../components/RestaurantCard";
import { getRestaurants } from "@/lib/restaurants";

export default async function Home() {
  const restaurants = await getRestaurants();

  const trendingRestaurants = [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative h-[60vh] min-h-[420px] md:h-[70vh] md:min-h-[560px] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {/* Public asset path — files inside /public are served from the site root,
              so public/videos/hero-video.mp4 is referenced as /videos/hero-video.mp4. */}
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full w-full flex-col justify-center px-4 md:px-16 text-white">
          <p className="mb-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-orange-400">
            FoodRush delivery
          </p>

          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
            Hot meals, fast delivery,{" "}
            <span className="text-orange-500">zero waiting drama.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm text-gray-200 md:text-lg">
            Discover top-rated restaurants, browse cuisines, and build your cart
            in minutes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/restaurants"
              className="rounded-xl bg-orange-600 px-5 py-3 text-sm md:text-base font-bold text-white shadow-lg shadow-orange-600/30 hover:bg-orange-700 hover:shadow-orange-700/40 active:scale-95 transition-all duration-200"
            >
              Order Now
            </Link>

            <Link
              href="/restaurants"
              className="rounded-xl border border-white/60 bg-white/10 backdrop-blur-sm px-5 py-3 text-sm md:text-base font-bold text-white hover:bg-white hover:text-orange-600 hover:border-white active:scale-95 transition-all duration-200"
            >
              Explore Restaurants
            </Link>
          </div>
        </div>
      </section>
      <div className="px-6 py-10">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Trending Restaurants
              </h2>
              <p className="mt-1 text-gray-600">
                Top-rated picks loved by FoodRush users.
              </p>
            </div>

            <Link
              href="/restaurants"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {trendingRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Popular cuisines
              </h2>
              <p className="mt-1 text-gray-600">
                Choose a cuisine and jump straight into matching restaurants.
              </p>
            </div>

            <Link
              href="/restaurants"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              See all restaurants
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Italian",
                description: "Pizza, pasta, and classic comfort food.",
              },
              {
                name: "Asian",
                description: "Stir-fry, noodles, rice bowls, and more.",
              },
              {
                name: "Pakistani",
                description: "Bold spices, kebabs, biryani, and curries.",
              },
              {
                name: "Mexican",
                description: "Fresh salsa, wraps, tacos, and smoky flavors.",
              },
              {
                name: "Japanese",
                description: "Ramen, sushi-inspired meals, and umami bowls.",
              },
              {
                name: "Mediterranean",
                description: "Fresh salads, grains, herbs, and light meals.",
              },
            ].map((cuisine) => (
              <Link
                key={cuisine.name}
                href={`/restaurants?cuisine=${cuisine.name}`}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-900">{cuisine.name}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {cuisine.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              label: "01",
              title: "Fast delivery",
              description:
                "Find meals with quick cook times and get your order moving faster.",
            },
            {
              label: "02",
              title: "Top rated picks",
              description:
                "Compare ratings and discover the meals customers keep coming back for.",
            },
            {
              label: "03",
              title: "Smart cart",
              description:
                "Adjust quantities, review totals, and stay in control before checkout.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">
                {feature.label}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
        <section className="mt-10 overflow-hidden rounded-2xl bg-gray-900 p-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">
                Hungry already?
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Build your cart in minutes.
              </h2>

              <p className="mt-2 max-w-xl text-gray-300">
                Explore top-rated meals, filter by cuisine, and checkout faster
                with FoodRush.
              </p>
            </div>

            <Link
              href="/restaurants"
              className="inline-flex w-fit rounded-md bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Start ordering
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
