export enum RetentionPolicy {
    Limits = 0,
    Interest = 1,
    WorkQueue = 2,
}

export enum StorageType {
    File = 0,
    Memory = 1,
}

export enum DiscardPolicy {
    Old = 0,
    New = 1,
}

export enum AckPolicy {
    None = "none",
    All = "all",
    Explicit = "explicit",
}

export interface StreamConfig {
    name: string;
    description?: string;
    subjects?: string[];
    retention: RetentionPolicy;
    storage: StorageType;
    max_msgs: number;
    max_bytes: number;
    max_age: number;
    discard: DiscardPolicy;
    num_replicas: number;
    no_ack?: boolean;
    template_id?: string;
    duplicate_window?: number;
}

export interface StreamInfo {
    config: StreamConfig;
    created: string | Date;
    state: {
        messages: number;
        bytes: number;
        first_seq: number;
        last_seq: number;
        consumer_count: number;
    };
}

export interface ConsumerConfig {
    durable_name?: string;
    description?: string;
    deliver_subject?: string;
    deliver_group?: string;
    deliver_policy: string;
    ack_policy: AckPolicy;
    ack_wait?: number;
    max_deliver?: number;
    filter_subject?: string;
    replay_policy: string;
    sample_frequency?: string;
    max_waiting?: number;
    max_ack_pending?: number;
    flow_control?: boolean;
    idle_heartbeat?: number;
    headers_only?: boolean;
}

export interface ConsumerInfo {
    stream_name: string;
    name: string;
    created: string | Date;
    config: ConsumerConfig;
    delivered: {
        consumer_seq: number;
        stream_seq: number;
    };
    ack_floor: {
        consumer_seq: number;
        stream_seq: number;
    };
    num_pending: number;
    num_redelivered: number;
    num_waiting: number;
    num_headers_only: number;
}
