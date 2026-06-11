import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const foodRushDemo = cookieStore.get("foodrush_demo");

  return Response.json({
    foodRushDemo: foodRushDemo?.value || "not found",
  });
}