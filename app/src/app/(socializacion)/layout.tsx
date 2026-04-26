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
            <main className="flex flex-1 items-center justify-center px-4">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}