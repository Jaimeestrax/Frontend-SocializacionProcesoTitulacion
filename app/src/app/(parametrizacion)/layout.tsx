import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarPrivate } from "@/components/sidebar-private";

export default function ParametrizacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <SidebarPrivate />
            <main className="flex-1 p-4 overflow-x-scroll">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}