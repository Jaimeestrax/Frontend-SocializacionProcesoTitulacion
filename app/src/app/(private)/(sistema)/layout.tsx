export default function SistemaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 p-4">
            {children}
        </main>
    );
}