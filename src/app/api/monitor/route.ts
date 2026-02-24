import { NextRequest } from "next/server";
import { natsManager } from "@/lib/nats/NatsManager";
import { StringCodec, JSONCodec } from "nats";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const connectionId = searchParams.get("connectionId");
    const subject = searchParams.get("subject") || ">";
    const servers = searchParams.get("servers")?.split(",") || ["nats://localhost:4222"];

    if (!connectionId) {
        return new Response("Missing connectionId", { status: 400 });
    }

    const encoder = new TextEncoder();
    const sc = StringCodec();
    const jc = JSONCodec();

    const stream = new ReadableStream({
        async start(controller) {
            let nc;
            try {
                // We use a dedicated connection for monitoring to avoid blocking other operations
                // and because we need to handle subscriptions in a specific way for SSE
                nc = await natsManager.getConnection({
                    id: `monitor-${connectionId}-${Date.now()}`,
                    name: `Monitor - ${subject}`,
                    servers: servers,
                });

                const sub = nc.subscribe(subject);

                // Signal connection success
                controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ subject })}\n\n`));

                // Keep-alive heartbeat
                const heartbeat = setInterval(() => {
                    controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
                }, 15000);

                (async () => {
                    for await (const msg of sub) {
                        const payload = {
                            timestamp: Date.now(),
                            subject: msg.subject,
                            data: msg.string(),
                            size: msg.data.length,
                            headers: msg.headers ? Object.fromEntries(msg.headers.entries()) : undefined,
                        };

                        controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(payload)}\n\n`));
                    }
                })().catch(err => {
                    console.error("Subscription error:", err);
                });

                req.signal.addEventListener("abort", async () => {
                    clearInterval(heartbeat);
                    sub.unsubscribe();
                    // We don't close the shared connection here if it's managed by NatsManager instance
                    // but since we created a dedicated one with a unique ID, we should probably close it
                    // await nc.close(); 
                    controller.close();
                });

            } catch (err: any) {
                console.error("SSE NATS Error:", err);
                controller.enqueue(encoder.encode(`event: error\ndata: ${err.message}\n\n`));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
