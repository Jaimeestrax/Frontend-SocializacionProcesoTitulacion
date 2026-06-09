import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function BreadcrumbNav({ currentPath }: { currentPath: string }) {
    return (
        <nav className="flex items-center gap-2 text-[11px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            <Link
                href="/"
                className="hover:text-primary transition-colors flex items-center gap-1"
            >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
                href="/subprocesos"
                className="hover:text-primary transition-colors"
            >
                Calendarización
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary truncate max-w-[150px] md:max-w-none">
                {currentPath}
            </span>
        </nav>
    );
}
