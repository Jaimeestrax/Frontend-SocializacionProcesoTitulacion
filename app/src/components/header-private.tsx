import { ToggleMode } from "@/components/toogle-mode";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";

export default function HeaderPrivate() {
    return (
        <header className="w-full flex justify-between px-4 py-4 shrink-0 bg-sidebar border-2">
            <div>
                <span className="text-primary font-bold text-sm md:text-lg xl:text-xl px-1 md:px-12">
                    SOPTI-SOFT
                </span>
            </div>

            <div className="flex gap-1">
                <ToggleMode />
                {/** Solo para desarrollo -> indica los breakpoints */}
                <ScreenSizeIndicator />
            </div>
        </header>
    )
}