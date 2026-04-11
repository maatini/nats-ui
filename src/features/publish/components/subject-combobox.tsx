"use client";

import * as React from "react";
import { ChevronsUpDown, History, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

const HISTORY_KEY = "nats-ui:publish:subject-history";
const MAX_HISTORY = 20;

export function useSubjectHistory() {
    const [history, setHistory] = useLocalStorage<string[]>(HISTORY_KEY, []);
    const push = React.useCallback((subject: string) => {
        const trimmed = subject.trim();
        if (!trimmed) return;
        setHistory(prev => {
            const next = [trimmed, ...prev.filter(s => s !== trimmed)];
            return next.slice(0, MAX_HISTORY);
        });
    }, [setHistory]);
    const remove = React.useCallback((subject: string) => {
        setHistory(prev => prev.filter(s => s !== subject));
    }, [setHistory]);
    return { history, push, remove };
}

interface SubjectComboboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

export function SubjectCombobox({ value, onChange, placeholder, id }: SubjectComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const { history, remove } = useSubjectHistory();

    return (
        <div className="flex gap-1">
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder ?? "orders.new"}
                className="bg-background border-border font-mono"
            />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Subject history"
                        disabled={history.length === 0}
                        className="shrink-0 bg-background border-border"
                    >
                        <ChevronsUpDown className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-0" align="end">
                    <Command>
                        <CommandList>
                            <CommandEmpty>No recent subjects.</CommandEmpty>
                            <CommandGroup heading="Recent">
                                {history.map((subject) => (
                                    <CommandItem
                                        key={subject}
                                        value={subject}
                                        onSelect={() => {
                                            onChange(subject);
                                            setOpen(false);
                                        }}
                                        className="group flex items-center justify-between font-mono text-xs"
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <History className="size-3 text-muted-foreground" />
                                            {subject}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Remove ${subject} from history`}
                                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                remove(subject);
                                            }}
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
