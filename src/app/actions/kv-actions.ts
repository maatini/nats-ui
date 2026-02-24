"use server";

import { natsManager } from "@/lib/nats/NatsManager";
import { NatsConnectionConfig } from "@/store/useNatsStore";
import { KVConfig, KvStatus } from "nats";

export async function listKVBuckets(config: NatsConnectionConfig) {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const buckets = await js.views.list();

        // NATS doesn't provide a simple list of buckets easily via views.list() in all envs
        // Alternative: check streams that start with "KV_"
        const jsm = await natsManager.getJetStreamManager(config);
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

        return { success: true, buckets: bucketStatuses };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to list buckets" };
    }
}

export async function createKVBucket(config: NatsConnectionConfig, kvConfig: Partial<KVConfig>) {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const kv = await js.views.kv(kvConfig.bucket!, kvConfig);
        const status = await kv.status();
        return { success: true, status };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to create bucket" };
    }
}

export async function deleteKVBucket(config: NatsConnectionConfig, bucket: string) {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const kv = await js.views.kv(bucket);
        await kv.destroy();
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to delete bucket" };
    }
}

export async function getKVKeys(config: NatsConnectionConfig, bucket: string) {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const kv = await js.views.kv(bucket);
        const keys = await kv.keys();
        const keyList: string[] = [];
        for await (const k of keys) {
            keyList.push(k);
        }
        return { success: true, keys: keyList };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to list keys" };
    }
}

export async function getKVEntry(config: NatsConnectionConfig, bucket: string, key: string) {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const kv = await js.views.kv(bucket);
        const entry = await kv.get(key);
        if (!entry) return { success: false, error: "Entry not found" };

        return {
            success: true,
            entry: {
                key: entry.key,
                value: entry.string(),
                revision: entry.revision,
                created: entry.created,
                delta: entry.delta,
                operation: entry.operation
            }
        };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to fetch entry" };
    }
}

export async function putKVEntry(config: NatsConnectionConfig, bucket: string, key: string, value: string) {
    try {
        const nc = await natsManager.getConnection(config);
        const js = nc.jetstream();
        const kv = await js.views.kv(bucket);
        const revision = await kv.put(key, value);
        return { success: true, revision };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to put entry" };
    }
}
