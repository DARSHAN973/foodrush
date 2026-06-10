import {
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "@/lib/restaurants";

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

export async function PATCH(request, { params }) {
  const { id } = await params;

  try {
    // PATCH body parsing — update routes need the id from the URL and the
    // changed fields from the JSON request body.
    const data = await request.json();

    // PATCH validation — at least one editable field must be sent, but unlike
    // POST, a partial update does not require every field.
    if (!data.name && !data.cuisine && !data.deliveryTime) {
      return Response.json(
        { message: "At least one field is required to update" },
        { status: 400 },
      );
    }

    const restaurant = await updateRestaurant(id, data);

    if (restaurant === null) {
      // Shared helpers return null for invalid, missing, or inactive rows.
      // Route handlers translate that data result into an HTTP 404 response.
      return Response.json(
        { message: "Restaurant not found" },
        { status: 404 },
      );
    }

    return Response.json(restaurant, { status: 200 });
  } catch (error) {
    console.error(`PATCH /api/restaurants/${id} failed:`, error);

    return Response.json(
      { message: "Failed to update restaurant" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    // Soft delete — FoodRush hides restaurants with isActive: false instead
    // of hard-deleting rows that future order/history data may still reference.
    const restaurant = await deleteRestaurant(id);

    if (restaurant === null) {
      return Response.json(
        { message: "Restaurant not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "Restaurant deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`DELETE /api/restaurants/${id} failed:`, error);

    return Response.json(
      { message: "Failed to delete restaurant" },
      { status: 500 },
    );
  }
}
