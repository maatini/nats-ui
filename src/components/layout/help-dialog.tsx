"use client";

import * as React from "react";
import { Keyboard } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SHORTCUTS: { keys: string[]; label: string }[] = [
    { keys: ["⌘", "K"], label: "Open command palette" },
    { keys: ["?"], label: "Show this help" },
    { keys: ["Esc"], label: "Close dialog / collapse message" },
    { keys: ["↑", "↓"], label: "Navigate message browser" },
    { keys: ["Enter"], label: "Expand focused message" },
    { keys: ["Home", "End"], label: "First / last message" },
];

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="min-w-[1.5rem] inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono text-foreground/80">
            {children}
        </kbd>
    );
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="size-4" /> Keyboard shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Navigate Cobra NATS faster with these shortcuts.
                    </DialogDescription>
                </DialogHeader>
                <div className="divide-y divide-border">
                    {SHORTCUTS.map(({ keys, label }) => (
                        <div key={label} className="flex items-center justify-between py-2 text-sm">
                            <span className="text-foreground/80">{label}</span>
                            <div className="flex items-center gap-1">
                                {keys.map((k, i) => (
                                    <React.Fragment key={`${label}-${i}`}>
                                        {i > 0 && <span className="text-muted-foreground text-[10px]">+</span>}
                                        <Kbd>{k}</Kbd>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
