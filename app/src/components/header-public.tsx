"use client"

import { ToggleMode } from "@/components/toogle-mode";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";
import { Button } from "@/components/ui/button";
import { Logs } from "lucide-react";

interface PublicHeaderProps {
    onOpenMenu: () => void;
    onGoToOnboarding: () => void;
}

export default function HeaderPublic({
    onOpenMenu,
    onGoToOnboarding
}: PublicHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between px-4 py-4 shrink-0 bg-sidebar backdrop-blur-md border-b border-border">
            <div>
                <span className="text-primary font-bold text-sm md:text-lg xl:text-xl px-1">
                    SOPTI-SOFT
                </span>
            </div>

            <div className="flex gap-1">
                <Button variant="link" className="border-2 border-primary hover:scale-110 transition-all duration-100 hover:cursor-pointer"
                    onClick={onGoToOnboarding}>
                    ¿Eres nuevo por aquí?
                </Button>
                <Button variant="link" className="hover:scale-110 transition-all duration-100 hover:cursor-pointer dark:border-0"
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