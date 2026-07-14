import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // SSE requires these exact headers:
  // text/event-stream → tells browser this is a live stream, not a normal JSON response
  // no-cache → prevents any proxy or CDN from buffering/caching the stream
  // keep-alive → tells the TCP connection to stay open instead of closing after one response
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  // TextEncoder converts JS strings → Uint8Array (binary).
  // ReadableStream.controller.enqueue() only accepts binary, not plain strings.
  const encoder = new TextEncoder();

  // ReadableStream — a Web Streams API primitive that keeps the HTTP response body
  // open and lets us write chunks to it over time (instead of sending once and closing).
  // start(controller) runs immediately when the stream is opened.
  const sseStream = new ReadableStream({
    async start(controller) {
      // SSE wire format: "data: <JSON>\n\n"
      // The double \n\n is the message delimiter — EventSource uses it to know
      // where one event ends and the next begins.
      function send(payload) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      }

      // Builds the full status snapshot we send to the client.
      // We track per-restaurant statuses because the vendor updates RestaurantOrder,
      // not ParentOrder — the parent status just aggregates sub-order completions.
      function buildSnapshot(order) {
        return {
          parentStatus: order.status,
          restaurants: order.restaurantOrders.map((ro) => ({
            id: ro.id,
            name: ro.restaurant.name,
            status: ro.status,
          })),
        };
      }

      // Fetch once immediately — before the 3-second interval fires.
      // This ensures the client gets current state right away.
      const initial = await getOrderById(id, session.user.id);

      if (!initial) {
        controller.close();
        return;
      }

      // Stringify the full snapshot to detect any change across sub-orders.
      // JSON.stringify comparison is safe here because the shape is stable.
      let lastSnapshotStr = JSON.stringify(buildSnapshot(initial));
      send(buildSnapshot(initial));

      // ParentOrder terminal states — COMPLETED means all restaurants delivered,
      // CANCELLED means order was abandoned or payment failed.
      const isTerminal = (status) =>
        status === "COMPLETED" || status === "CANCELLED";

      if (isTerminal(initial.status)) {
        controller.close();
        return;
      }

      // Poll the DB every 3 seconds. Only push to client when something changed.
      // setInterval callback is async because getOrderById is a Prisma call.
      const interval = setInterval(async () => {
        const order = await getOrderById(id, session.user.id);

        if (!order) {
          clearInterval(interval);
          controller.close();
          return;
        }

        const newSnapshot = buildSnapshot(order);
        const newSnapshotStr = JSON.stringify(newSnapshot);

        // Only push if any status changed — avoids redundant messages every 3 seconds.
        if (newSnapshotStr !== lastSnapshotStr) {
          lastSnapshotStr = newSnapshotStr;
          send(newSnapshot);
        }

        if (isTerminal(order.status)) {
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      // Abort handler — fires when the client closes the tab or navigates away.
      // Without this, setInterval keeps running on the server forever (memory leak).
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(sseStream, { headers });
}
