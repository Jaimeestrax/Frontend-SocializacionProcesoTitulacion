import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function SocializacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-1 items-center justify-center px-4">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}