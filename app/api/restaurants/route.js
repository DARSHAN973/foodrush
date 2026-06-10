import { createRestaurant, getRestaurants } from "@/lib/restaurants";

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
    // Request body parsing — POST data lives in the request body, so the
    // route must parse it before validation or Prisma create logic can run.
    const data = await request.json();

    // Required field validation — create routes need enough data to make a
    // valid Restaurant row, so bad client input gets a 400 before Prisma runs.
    if (!data.name || !data.cuisine || !data.deliveryTime) {
      return Response.json(
        {
          message: "Name, cuisine, and delivery time are required",
        },
        { status: 400 },
      );
    }

    const restaurant = await createRestaurant(data);

    // 201 Created — POST made a new Restaurant resource.
    return Response.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("POST /api/restaurants failed:", error);

    return Response.json(
      { message: "Failed to create restaurant" },
      { status: 500 },
    );
  }
}
