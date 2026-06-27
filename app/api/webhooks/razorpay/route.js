import crypto from "crypto";
export async function POST(req) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text();
    const webHookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", webHookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return Response.json({ error: "Invalid Signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    console.log("Verify event :", body.event);
    return Response.json({ status: "ok" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
