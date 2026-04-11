"use client";

import * as React from "react";
import { CommandPalette } from "@/components/layout/command-palette";
import { HelpDialog } from "@/components/layout/help-dialog";

/**
 * Mounts global keyboard shortcuts (⌘K / ?) and the command palette + help dialog.
 */
export function GlobalShortcuts() {
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    const [helpOpen, setHelpOpen] = React.useState(false);

    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const isEditable =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable;

            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setPaletteOpen(open => !open);
                return;
            }
            if (!isEditable && e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                setHelpOpen(open => !open);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <>
            <CommandPalette
                open={paletteOpen}
                onOpenChange={setPaletteOpen}
                onShowHelp={() => setHelpOpen(true)}
            />
            <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
        </>
    );
}
