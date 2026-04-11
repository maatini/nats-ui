"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

/**
 * Generic empty-state card used for no-data / no-connection / filtered-to-nothing.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/30 px-6 py-12 text-center",
                className
            )}
        >
            {Icon && (
                <div className="rounded-full bg-muted p-4 mb-4">
                    <Icon className="size-8 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-base font-medium text-foreground/90">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
