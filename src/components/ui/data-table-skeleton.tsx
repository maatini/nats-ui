import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
    rows?: number;
    columns?: number;
}

/**
 * Table-shaped skeleton placeholder used while a list of rows is loading.
 */
export function DataTableSkeleton({ rows = 6, columns = 4 }: DataTableSkeletonProps) {
    return (
        <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
            <div className="grid gap-2 border-b border-border bg-muted/30 p-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-24" />
                ))}
            </div>
            <div className="divide-y divide-border">
                {Array.from({ length: rows }).map((_, r) => (
                    <div
                        key={r}
                        className="grid gap-2 p-3"
                        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                    >
                        {Array.from({ length: columns }).map((_, c) => (
                            <Skeleton key={c} className="h-4 w-full max-w-[180px]" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
