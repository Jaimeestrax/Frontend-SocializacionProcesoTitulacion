"use client"

import { ToggleMode } from "@/components/toogle-mode";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogIn, Logs } from "lucide-react";
import { data } from "@/constants/menu-public";
import { useRouter, usePathname } from "next/navigation";

interface PublicHeaderProps {
    onOpenMenu: () => void;
    onGoToOnboarding: () => void;
}

export default function HeaderPublic({
    onOpenMenu,
    onGoToOnboarding
}: PublicHeaderProps) {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between px-4 py-4 shrink-0 bg-sidebar backdrop-blur-md border-b border-border">
            {/* Logo izquierda */}
            <div className="flex items-center gap-1">
                <GraduationCap className="text-primary" />
                <span className="text-primary font-bold text-sm md:text-lg xl:text-xl px-1">
                    SOPTI-SOFT
                </span>
            </div>

            {/* Nav en el medio — solo visible en md+ */}
            <nav className="hidden lg:flex items-center gap-1">
                {data.items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <Button
                            key={item.title}
                            variant="ghost"
                            onClick={() => router.push(item.url)}
                            className={`text-md transition-all hover:scale-110 hover:cursor-pointer ${isActive ? "text-primary text-lg bg-primary/10 hover:text-destructive" : "text-muted-foreground hover:text-primary"}`}
                        >
                            {item.title}
                        </Button>
                    );
                })}
            </nav>

            {/* Acciones derechas */}
            <div className="flex items-center gap-1">
                <Button variant="link" className="hidden md:inline-flex border-2 border-primary hover:scale-110 transition-all duration-100 hover:cursor-pointer"
                    onClick={onGoToOnboarding}>
                    ¿Nuevo por aquí?
                </Button>

                {/* Iniciar sesión solo en md+ */}
                <Button variant="default" className="hidden lg:inline-flex hover:scale-105 transition-all duration-100 hover:cursor-pointer"
                    onClick={() => router.push("/auth/sign-in")}>
                    <LogIn />
                    Iniciar sesión
                </Button>

                <Button variant="link" className="lg:hidden hover:scale-110 transition-all duration-100 hover:cursor-pointer dark:border-0"
                    onClick={onOpenMenu}>
                    <Logs />
                </Button>
                <ToggleMode />
                {/** Solo para desarrollo -> indica los breakpoints */}
                <ScreenSizeIndicator />
            </div>
        </header>
    )
}