"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Layers,
    Database,
    HardDrive,
    Send,
    Monitor,
    Settings,
    Keyboard,
    Plus,
} from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useNatsStore } from "@/features/connections/store";

interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onShowHelp: () => void;
}

const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/streams", label: "Streams", icon: Layers },
    { href: "/kv", label: "KV Stores", icon: Database },
    { href: "/os", label: "Object Stores", icon: HardDrive },
    { href: "/publish", label: "Publish Message", icon: Send },
    { href: "/monitor", label: "Subject Monitor", icon: Monitor },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function CommandPalette({ open, onOpenChange, onShowHelp }: CommandPaletteProps) {
    const router = useRouter();
    const { connections, activeConnectionId, setActiveConnection } = useNatsStore();

    const go = (href: string) => {
        onOpenChange(false);
        router.push(href);
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Jump to a page, switch connection, or run a command..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                        <CommandItem key={href} value={label} onSelect={() => go(href)}>
                            <Icon className="size-4" />
                            <span>{label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                {connections.length > 0 && (
                    <>
                        <CommandSeparator />
                        <CommandGroup heading="Connections">
                            {connections.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    value={`connection ${c.name}`}
                                    onSelect={() => {
                                        setActiveConnection(c.id);
                                        onOpenChange(false);
                                    }}
                                >
                                    <Plus className="size-4" />
                                    <span>Switch to {c.name}</span>
                                    {activeConnectionId === c.id && (
                                        <span className="ml-auto text-[10px] text-emerald-400">active</span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </>
                )}
                <CommandSeparator />
                <CommandGroup heading="Help">
                    <CommandItem
                        value="keyboard shortcuts help"
                        onSelect={() => {
                            onOpenChange(false);
                            onShowHelp();
                        }}
                    >
                        <Keyboard className="size-4" />
                        <span>Keyboard shortcuts</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">?</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
