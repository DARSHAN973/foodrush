import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  // Cryptographic Webhook Signature Verification — since this endpoint is public,
  // we must verify that the incoming payload actually came from Razorpay and was
  // not tampered with. We generate an HMAC-SHA256 hash of the raw request body
  // using our shared webhook secret and compare it to Razorpay's signature header.

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

    if (body.event === "payment.failed") {
      // Database synchronization — since providerOrderId is not a unique index
      // in our schema, we must query findFirst to retrieve the payment record.
      // Once located, we update the payment status to FAILED and transit the matching
      // ParentOrder to CANCELLED to prevent stuck PAYMENT_PENDING records.

      const orderId = body.payload.payment.entity.order_id;

      const payment = await prisma.payment.findFirst({
        where: { providerOrderId: orderId },
      });

      if (!payment) {
        return Response.json({ error: "Order not found" }, { status: 404 });
      }
      if (payment.id) {
        const updatePaymentStatus = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
          },
        });
      }

      const parentOrder = await prisma.parentOrder.update({
        where: { id: payment.parentOrderId },
        data: {
          status: "CANCELLED",
        },
      });
    }
    console.log("Verify event :", body.event);
    return Response.json({ status: "ok" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
