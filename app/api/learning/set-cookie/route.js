export async function GET() {
  const response = Response.json({
    message: "Cookie set",
  });

  response.headers.set("Set-Cookie", "foodrush_demo=darshan; Path=/; HttpOnly");

  return response;
}
