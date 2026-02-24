"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="flex flex-col bg-slate-950">
                <Topbar />
                <main className="flex-1 overflow-auto p-4 lg:p-6 pb-20 lg:pb-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
