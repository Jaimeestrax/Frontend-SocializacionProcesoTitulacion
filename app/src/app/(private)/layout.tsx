import FooterPrivate from "@/components/footer-private";
import HeaderPrivate from "@/components/header-private";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarPrivate } from "@/components/sidebar-private";


export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <HeaderPrivate />

            <SidebarProvider className="flex-1 min-h-0">
                <SidebarPrivate />
                <main className="flex-1 overflow-y-auto">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>


            <FooterPrivate />
        </div>
    )
}