"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AutoRefreshSelectProps {
    interval: number;
    onChange: (seconds: number) => void;
    intervals?: number[];
}

export function AutoRefreshSelect({
    interval,
    onChange,
    intervals = [0, 5, 15, 30, 60],
}: AutoRefreshSelectProps) {
    return (
        <Select value={String(interval)} onValueChange={(v) => onChange(Number(v))}>
            <SelectTrigger size="sm" className="h-8 text-xs bg-card border-border gap-2 w-[140px]">
                <Clock className="size-3 text-muted-foreground" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {intervals.map((sec) => (
                    <SelectItem key={sec} value={String(sec)} className="text-xs">
                        {sec === 0 ? "Manual refresh" : `Every ${sec}s`}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
