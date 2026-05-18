import FooterPrivate from "@/components/footer-private";
import HeaderPrivate from "@/components/header-private";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <HeaderPrivate />

            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>

            <FooterPrivate />
        </div>
    );
}