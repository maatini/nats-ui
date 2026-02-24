import { natsManager } from "@/lib/nats/NatsManager";
import { NatsConnectionConfig } from "@/store/useNatsStore";
import { NatsConnection, JetStreamClient, JetStreamManager } from "nats";

export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };

/**
 * Wraps a NATS operation with standard error handling and connection retrieval.
 */
export async function withNatsConnection<T>(
    config: NatsConnectionConfig,
    operationName: string,
    operation: (nc: NatsConnection) => Promise<T>
): Promise<ActionResponse<T>> {
    try {
        const nc = await natsManager.getConnection(config);
        const result = await operation(nc);
        return { success: true, data: result };
    } catch (err: any) {
        console.error(`[NATS Action Error] ${operationName}:`, err);
        return { success: false, error: err.message || `Failed to execute ${operationName}` };
    }
}

/**
 * Wraps a JetStream operation, providing both the client and manager.
 */
export async function withJetStream<T>(
    config: NatsConnectionConfig,
    operationName: string,
    operation: (params: { js: JetStreamClient; jsm: JetStreamManager }) => Promise<T>
): Promise<ActionResponse<T>> {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const jsm = await nc.jetstreamManager();
        const result = await operation({ js, jsm });
        return { success: true, data: result };
    } catch (err: any) {
        console.error(`[JetStream Action Error] ${operationName}:`, err);
        return { success: false, error: err.message || `Failed to execute ${operationName}` };
    }
}
