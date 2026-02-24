"use server";

import { natsManager } from "@/lib/nats/NatsManager";
import { NatsConnectionConfig } from "@/store/useNatsStore";
import { headers, Msg, JSONCodec } from "nats";

export async function publishMessage(
    config: NatsConnectionConfig,
    subject: string,
    payload: string,
    msgHeaders?: Record<string, string>
) {
    try {
        const nc = await natsManager.getConnection(config);
        const jc = JSONCodec();

        const opts: any = {};
        if (msgHeaders && Object.keys(msgHeaders).length > 0) {
            const h = headers();
            for (const [k, v] of Object.entries(msgHeaders)) {
                h.append(k, v);
            }
            opts.headers = h;
        }

        // Attempt to parse JSON if possible, otherwise use as string
        let data: any = payload;
        try {
            data = JSON.parse(payload);
            nc.publish(subject, jc.encode(data), opts);
        } catch {
            nc.publish(subject, payload, opts);
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to publish message" };
    }
}

export async function requestMessage(
    config: NatsConnectionConfig,
    subject: string,
    payload: string,
    timeout: number = 5000
) {
    try {
        const nc = await natsManager.getConnection(config);
        const jc = JSONCodec();

        // Attempt to parse JSON if possible, otherwise use as string
        let data: any = payload;
        try {
            data = JSON.parse(payload);
        } catch { }

        const msg = await nc.request(subject, typeof data === 'string' ? data : jc.encode(data), { timeout });

        return {
            success: true,
            reply: {
                subject: msg.subject,
                data: msg.string(),
                headers: msg.headers ? Object.fromEntries(msg.headers.entries()) : undefined
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message || "Request timed out or failed" };
    }
}
