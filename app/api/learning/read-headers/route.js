import { headers } from "next/headers";

export async function GET() {
  const headerStore = await headers();

  return Response.json({
    userAgent: headerStore.get("user-agent"),
    cookie: headerStore.get("cookie"),
  });
}