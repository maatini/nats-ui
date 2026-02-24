"use server";

import { natsManager } from "@/lib/nats/NatsManager";
import { NatsConnectionConfig } from "@/store/useNatsStore";
import { StreamConfig, StreamInfo } from "nats";

export async function listStreams(config: NatsConnectionConfig) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        const streams = await jsm.streams.list().next();
        // Materialize the list since NATS uses iterators
        const streamList: StreamInfo[] = [];
        const iter = await jsm.streams.list();
        for await (const s of iter) {
            streamList.push(s);
        }
        return { success: true, streams: streamList };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to list streams" };
    }
}

export async function createStream(config: NatsConnectionConfig, streamConfig: StreamConfig) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        const info = await jsm.streams.add(streamConfig);
        return { success: true, info };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to create stream" };
    }
}

export async function deleteStream(config: NatsConnectionConfig, streamName: string) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        await jsm.streams.delete(streamName);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to delete stream" };
    }
}

export async function getStreamInfo(config: NatsConnectionConfig, streamName: string) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        const info = await jsm.streams.info(streamName);
        return { success: true, info };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to fetch stream info" };
    }
}
