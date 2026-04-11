"use client";

import * as React from "react";

export interface Shortcut {
    /** Lowercase key, e.g. "k", "escape", "arrowup". */
    key: string;
    meta?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    /** Handler; return false to allow the default. */
    handler: (e: KeyboardEvent) => void;
    /** Optional human-readable label for a help dialog. */
    label?: string;
}

/**
 * Registers a set of keyboard shortcuts on window. Ignores keystrokes that
 * originate from inputs/textareas/contenteditable so users typing into forms
 * are not hijacked. Re-registers when the `shortcuts` array changes.
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
    React.useEffect(() => {
        if (!enabled) return;

        const handler = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const tag = target?.tagName;
            const isEditable =
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT" ||
                target?.isContentEditable;

            for (const s of shortcuts) {
                if (e.key.toLowerCase() !== s.key.toLowerCase()) continue;
                if (!!s.meta !== e.metaKey) continue;
                if (!!s.ctrl !== e.ctrlKey) continue;
                if (!!s.shift !== e.shiftKey) continue;
                if (!!s.alt !== e.altKey) continue;
                // Allow Escape to flow through inputs (e.g. to close dialogs).
                if (isEditable && s.key.toLowerCase() !== "escape") continue;
                s.handler(e);
                return;
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [shortcuts, enabled]);
}
