"use client";

import * as React from "react";
import { MessageSquareQuote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonViewer } from "@/components/ui/json-viewer";
import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReplyOutputProps {
    reply: { data: string; headers?: Record<string, string> };
}

export function ReplyOutput({ reply }: ReplyOutputProps) {
    const headerEntries = reply.headers ? Object.entries(reply.headers) : [];

    return (
        <Card className="bg-card border-emerald-500/30 animate-in zoom-in-95 duration-300">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm flex items-center gap-2 text-emerald-400">
                    <MessageSquareQuote className="size-4" />
                    Reply Received
                </CardTitle>
                <CopyButton value={reply.data} />
            </CardHeader>
            <CardContent>
                <ScrollArea className="max-h-[240px] rounded-md border border-border bg-background p-2">
                    <JsonViewer
                        value={reply.data}
                        className="text-[11px]"
                        rawClassName="text-[11px] text-foreground/80"
                        showBadge
                    />
                </ScrollArea>
                {headerEntries.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Headers</span>
                        {headerEntries.map(([k, v]) => (
                            <div key={k} className="text-[10px] text-muted-foreground flex gap-2 font-mono">
                                <span className="font-bold text-foreground/70">{k}:</span>
                                <span>{v}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
