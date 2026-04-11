"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
    value: string;
    label?: string;
    silent?: boolean;
}

/**
 * Icon button that copies `value` to the clipboard and flashes a check mark
 * for ~1.5s. Shows a toast unless `silent` is set.
 */
export function CopyButton({
    value,
    label = "Copy",
    silent = false,
    className,
    variant = "ghost",
    size = "icon",
    ...props
}: CopyButtonProps) {
    const [copied, setCopied] = React.useState(false);

    const onClick = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            if (!silent) toast.success(`${label} copied`);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Copy failed");
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={onClick}
            aria-label={label}
            className={cn("h-8 w-8 text-muted-foreground hover:text-foreground", className)}
            {...props}
        >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
        </Button>
    );
}
