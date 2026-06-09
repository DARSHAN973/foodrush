import { getRestaurants } from "@/lib/restaurants";
import { createRestaurant } from "@/lib/restaurants";

export async function GET() {
  try {
    const restaurants = await getRestaurants();
    // List routes usually do not need 404 for empty data.
    // An empty restaurant collection is still a valid 200 OK response.
    return Response.json(restaurants);
  } catch (error) {
    console.error("GET /api/restaurants failed:", error);

    // 500 response — log the real server error, but return a safe message
    // so database details are not exposed to the frontend.
    return Response.json(
      { message: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (
      !data.name ||
      !data.cuisine ||
      !data.deliveryTime
    ) {
      return Response.json(
        {
          message:
            "Name, cuisine, and delivery time are required",
        },
        { status: 400 },
      );
    }

    const restaurant = await createRestaurant(data);

    return Response.json(restaurant , {status:201})

  } catch (error) {
    console.log("POST /api/restaurants failed:", error);

    return Response.json(
      { message: "Failed to create restaurant" },
      { status: 500 },
    );
  }
}
