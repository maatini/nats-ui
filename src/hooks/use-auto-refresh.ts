"use client";

import * as React from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface AutoRefreshOptions {
    storageKey: string;
    intervals?: number[];
    defaultInterval?: number;
}

/**
 * Schedules a periodic callback whose interval is persisted to localStorage.
 * `interval` of 0 disables auto-refresh.
 */
export function useAutoRefresh(
    callback: () => void,
    { storageKey, intervals = [0, 5, 15, 30, 60], defaultInterval = 0 }: AutoRefreshOptions
) {
    const [interval, setInterval] = useLocalStorage<number>(storageKey, defaultInterval);
    const cbRef = React.useRef(callback);
    React.useEffect(() => { cbRef.current = callback; }, [callback]);

    React.useEffect(() => {
        if (!interval) return;
        const id = window.setInterval(() => cbRef.current(), interval * 1000);
        return () => window.clearInterval(id);
    }, [interval]);

    return { interval, setInterval, intervals };
}
