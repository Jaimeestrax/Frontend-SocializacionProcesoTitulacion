"use client"

export function ScreenSizeIndicator() {
    return (
        <div className="rounded-md bg-foreground text-background px-4 py-1 text-md">
            {/** Breakpoints TailwindCSS para diseño responsive */}
            <span className="block sm:hidden">xs</span>
            <span className="hidden sm:block md:hidden">sm</span>
            <span className="hidden md:block lg:hidden">md</span>
            <span className="hidden lg:block xl:hidden">lg</span>
            <span className="hidden xl:block 2xl:hidden">xl</span>
            <span className="hidden 2xl:block">2xl</span>
        </div>
    )
}