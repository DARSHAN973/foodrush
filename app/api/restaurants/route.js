import { getRestaurants } from "@/lib/restaurants";

export async function GET() {
  try {
    const restaurants = await getRestaurants();
    // List routes usually do not need 404 for empty data.
    // An empty restaurant collection is still a valid 200 OK response.
    return Response.json(restaurants);
  } catch {
    return Response.json(
      { message: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
}
