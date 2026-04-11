"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SEGMENT_LABELS: Record<string, string> = {
    "": "Dashboard",
    streams: "Streams",
    kv: "KV Stores",
    os: "Object Store",
    publish: "Publish",
    monitor: "Monitor",
    settings: "Settings",
};

/**
 * Builds breadcrumb items from the current pathname. Dynamic segments (the
 * stream/bucket name) are rendered as-is. Intermediate segments become links,
 * the last segment is the active page.
 */
export function AutoBreadcrumbs() {
    const pathname = usePathname() || "/";
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((seg, i) => {
                    const href = "/" + segments.slice(0, i + 1).join("/");
                    const isLast = i === segments.length - 1;
                    const label = SEGMENT_LABELS[seg] ?? decodeURIComponent(seg);
                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="max-w-[220px] truncate">
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
