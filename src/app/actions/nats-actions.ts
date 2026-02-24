"use server";

import { natsManager, NatsConfig } from "@/lib/nats/NatsManager";

export async function testConnection(config: Omit<NatsConfig, "id">) {
    const tempId = `test-${Date.now()}`;
    try {
        const nc = await natsManager.getConnection({ ...config, id: tempId });
        const serverInfo = nc.info;
        await natsManager.closeConnection(tempId);
        return { success: true, serverInfo };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to connect to NATS" };
    }
}

export async function getServerInfo(config: NatsConfig) {
    try {
        const nc = await natsManager.getConnection(config);
        return { success: true, info: nc.info };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to fetch server info" };
    }
}
