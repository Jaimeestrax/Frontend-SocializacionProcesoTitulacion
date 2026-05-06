import type { Metadata } from "next";
import type { Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";
import { Providers } from "./providers";
import { ToggleMode } from "@/components/toogle-mode";
import { Toaster } from "@/components/ui/sonner"

const robotoSans = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOPTI-SOFT",
  description: "Socialización del Proceso de Titulación"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es" suppressHydrationWarning
      className={`${robotoSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground h-full overflow-hidden">
        <Providers>
          <div className="flex h-full flex-col">
            <header className="w-full flex justify-between px-4 py-4 shrink-0 bg-sidebar border-2">
              <div>
                <span className="text-primary font-bold text-sm md:text-lg xl:text-xl px-1 md:px-12">
                  SOPTI-SOFT
                </span>
              </div>

              <div className="flex">
                <ToggleMode />
                {/** Solo para desarrollo -> indica los breakpoints */}
                <ScreenSizeIndicator />
              </div>
            </header>

            <main className="flex-1 overflow-y-auto">
              {children}
            </main>

            <footer className="text-right text-sm py-4 px-4 bg-sidebar text-muted-foreground font-bold shrink-0 border-2">
              Socialización del Proceso de Titulación {new Date().getFullYear()} ©
            </footer>
          </div>
          <Toaster expand visibleToasts={1} />
        </Providers>
      </body>
    </html>
  );
}
