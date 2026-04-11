"use client";

import { usePathname } from "next/navigation";
import { WifiOff } from "lucide-react";

import { useActiveConnection } from "@/features/connections/hooks";
import { ConnectDialog } from "@/features/connections/components/connect-dialog";
import { Button } from "@/components/ui/button";

/**
 * Sticky warning strip shown whenever there is no active NATS connection.
 * Hidden on the settings route so the user can manage connections in peace.
 */
export function NoConnectionBanner() {
    const activeConnection = useActiveConnection();
    const pathname = usePathname();

    if (activeConnection) return null;
    if (pathname?.startsWith("/settings")) return null;

    return (
        <div className="flex items-center gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-500 lg:px-6">
            <WifiOff className="size-4 shrink-0" />
            <span className="flex-1 truncate">
                No active NATS connection — most features are disabled until you connect.
            </span>
            <ConnectDialog
                trigger={
                    <Button
                        size="sm"
                        className="h-7 bg-amber-500 text-amber-950 hover:bg-amber-400"
                    >
                        Connect
                    </Button>
                }
            />
        </div>
    );
}
