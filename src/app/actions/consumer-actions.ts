"use server";

import { natsManager } from "@/lib/nats/NatsManager";
import { NatsConnectionConfig } from "@/store/useNatsStore";
import { ConsumerConfig, ConsumerInfo } from "nats";

export async function listConsumers(config: NatsConnectionConfig, stream: string) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        const iter = await jsm.consumers.list(stream);
        const consumerList: ConsumerInfo[] = [];
        for await (const c of iter) {
            consumerList.push(c);
        }
        return { success: true, consumers: consumerList };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to list consumers" };
    }
}

export async function createConsumer(config: NatsConnectionConfig, stream: string, consumerConfig: ConsumerConfig) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        const info = await jsm.consumers.add(stream, consumerConfig);
        return { success: true, info };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to create consumer" };
    }
}

export async function deleteConsumer(config: NatsConnectionConfig, stream: string, consumer: string) {
    try {
        const jsm = await natsManager.getJetStreamManager(config);
        await jsm.consumers.delete(stream, consumer);
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Failed to delete consumer" };
    }
}
