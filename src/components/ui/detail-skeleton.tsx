import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Two-column card skeleton used as the fallback while a detail page
 * (stream/bucket/object) is loading.
 */
export function DetailSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-9 w-28" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {[0, 1].map(i => (
                    <Card key={i} className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-5 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Array.from({ length: 6 }).map((_, j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
