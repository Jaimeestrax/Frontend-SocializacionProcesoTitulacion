import { SidebarPublic } from "@/components/sidebar-public";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function SocializacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <SidebarPublic />
            <main className="flex-1 px-2">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}