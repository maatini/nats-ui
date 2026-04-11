"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

/**
 * Options supplied to a single `confirm()` invocation.
 */
export interface ConfirmOptions {
    title: string;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    /** Style of the confirm button. `destructive` is the default and uses rose. */
    variant?: "destructive" | "default";
    /**
     * If provided, the user must type this exact string into an input before
     * the confirm button becomes enabled. Used as a typo guard for destructive
     * actions like deleting a stream or bucket.
     */
    typedName?: string;
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn | null>(null);

/**
 * Hook returning a promise-based confirm function. Replaces `window.confirm`
 * with a styled Radix-powered dialog that matches the rest of the UI.
 */
export function useConfirm(): ConfirmFn {
    const ctx = React.useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
    return ctx;
}

interface PendingRequest {
    opts: ConfirmOptions;
    resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [request, setRequest] = React.useState<PendingRequest | null>(null);
    const [typed, setTyped] = React.useState("");

    const confirm = React.useCallback<ConfirmFn>(opts => {
        return new Promise<boolean>(resolve => {
            setTyped("");
            setRequest({ opts, resolve });
        });
    }, []);

    const close = (result: boolean) => {
        if (request) {
            request.resolve(result);
            setRequest(null);
            setTyped("");
        }
    };

    const opts = request?.opts;
    const variant = opts?.variant ?? "destructive";
    const needsType = !!opts?.typedName;
    const typeMatches = needsType ? typed === opts?.typedName : true;

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <Dialog
                open={request !== null}
                onOpenChange={open => {
                    if (!open) close(false);
                }}
            >
                <DialogContent className="sm:max-w-[440px] bg-background border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle
                                className={
                                    variant === "destructive"
                                        ? "size-5 text-rose-500"
                                        : "size-5 text-amber-500"
                                }
                            />
                            {opts?.title}
                        </DialogTitle>
                        {opts?.description && (
                            <DialogDescription className="text-muted-foreground pt-2">
                                {opts.description}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    {needsType && opts?.typedName && (
                        <div className="flex flex-col gap-2 pt-1">
                            <label className="text-xs text-muted-foreground">
                                Type{" "}
                                <span className="font-mono text-foreground">
                                    {opts.typedName}
                                </span>{" "}
                                to confirm:
                            </label>
                            <Input
                                autoFocus
                                value={typed}
                                onChange={e => setTyped(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && typeMatches) close(true);
                                }}
                                className="bg-card border-border font-mono"
                                placeholder={opts.typedName}
                                aria-label="Confirm name"
                            />
                        </div>
                    )}
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => close(false)}
                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                            {opts?.cancelText ?? "Cancel"}
                        </Button>
                        <Button
                            type="button"
                            disabled={!typeMatches}
                            onClick={() => close(true)}
                            className={
                                variant === "destructive"
                                    ? "bg-rose-600 hover:bg-rose-700 text-white min-w-[110px] disabled:opacity-50"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white min-w-[110px] disabled:opacity-50"
                            }
                        >
                            {opts?.confirmText ?? "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmContext.Provider>
    );
}
