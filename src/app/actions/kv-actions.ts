"use server";

import { natsManager } from "@/lib/nats/NatsManager";
import { NatsConnectionConfig } from "@/store/useNatsStore";
import { KvOptions, KvStatus } from "nats";
import { withJetStream, ActionResponse } from "./action-helpers";

export async function listKVBuckets(config: NatsConnectionConfig): Promise<ActionResponse<{ buckets: KvStatus[] }>> {
    return withJetStream(config, "listKVBuckets", async ({ js, jsm }) => {
        // NATS doesn't provide a simple list of buckets easily via views.list() in all envs
        // Alternative: check streams that start with "KV_"
        const streams = await jsm.streams.list().next();
        const bucketNames: string[] = [];
        const iter = await jsm.streams.list();
        for await (const s of iter) {
            if (s.config.name.startsWith("KV_")) {
                bucketNames.push(s.config.name.substring(3));
            }
        }

        const bucketStatuses: KvStatus[] = [];
        for (const name of bucketNames) {
            const kv = await js.views.kv(name);
            const status = await kv.status();
            bucketStatuses.push(status);
        }

        return { buckets: bucketStatuses };
    });
}

export async function createKVBucket(config: NatsConnectionConfig, kvConfig: Partial<KvOptions & { bucket: string }>): Promise<ActionResponse<{ status: KvStatus }>> {
    return withJetStream(config, "createKVBucket", async ({ js }) => {
        const { bucket, ...options } = kvConfig;
        const kv = await js.views.kv(bucket!, options as Partial<KvOptions>);
        const status = await kv.status();
        return { status };
    });
}

export async function deleteKVBucket(config: NatsConnectionConfig, bucket: string): Promise<ActionResponse<void>> {
    return withJetStream(config, "deleteKVBucket", async ({ js }) => {
        const kv = await js.views.kv(bucket);
        await kv.destroy();
    });
}

export async function getKVKeys(config: NatsConnectionConfig, bucket: string): Promise<ActionResponse<{ keys: string[] }>> {
    return withJetStream(config, "getKVKeys", async ({ js }) => {
        const kv = await js.views.kv(bucket);
        const keys = await kv.keys();
        const keyList: string[] = [];
        for await (const k of keys) {
            keyList.push(k);
        }
        return { keys: keyList };
    });
}

export async function getKVEntry(config: NatsConnectionConfig, bucket: string, key: string): Promise<ActionResponse<{ entry: any }>> {
    return withJetStream(config, "getKVEntry", async ({ js }) => {
        const kv = await js.views.kv(bucket);
        const entry = await kv.get(key);
        if (!entry) throw new Error("Entry not found");

        return {
            entry: {
                key: entry.key,
                value: entry.string(),
                revision: entry.revision,
                created: entry.created,
                delta: entry.delta,
                operation: entry.operation
            }
        };
    });
}

export async function putKVEntry(config: NatsConnectionConfig, bucket: string, key: string, value: string): Promise<ActionResponse<{ revision: number }>> {
    return withJetStream(config, "putKVEntry", async ({ js }) => {
        const kv = await js.views.kv(bucket);
        const revision = await kv.put(key, value);
        return { revision };
    });
}
