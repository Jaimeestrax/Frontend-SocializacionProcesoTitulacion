import { NavbarPublic } from "@/components/navbar-public";
import { ChatbotButton } from "@/components/chatbot-button";

export default function SocializacionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <NavbarPublic />

            <main className="flex-1 py-2 px-4 mt-20">
                {children}
            </main>

            {/* Botón flotante chatbot */}
            <div className="fixed bottom-10 right-10 z-50">
                <ChatbotButton />
            </div>
        </div>
    );
}