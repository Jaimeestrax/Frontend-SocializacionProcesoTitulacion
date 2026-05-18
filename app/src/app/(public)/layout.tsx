import { SidebarPublic } from "@/components/sidebar-public";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatbotButton } from "@/components/chatbot-button";

export default function SocializacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <SidebarPublic />
            <main className="flex-1 py-2 px-4 overflow-x-scroll">
                <SidebarTrigger />
                {children}
                {/** Botón flotante chatbot */}
                <div className="fixed bottom-16 right-4">
                    <ChatbotButton />
                </div>
            </main>
        </SidebarProvider>
    );
}