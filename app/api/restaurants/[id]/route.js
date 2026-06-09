import { getRestaurant } from "@/lib/restaurants";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const restaurant = await getRestaurant(id);
    if (restaurant === null) {
      // 404 response — missing data should be reported as "not found"
      // instead of returning null with 200 OK, which can confuse the frontend.
      return Response.json(
        { message: "Restaurant not found" },
        { status: 404 },
      );
    }

    return Response.json(restaurant);
  } catch (error) {
    console.error(`GET /api/restaurants/${id} failed:`, error);

    // 500 response — log the real server error, but return a safe message
    // so database details are not exposed to the frontend.
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
