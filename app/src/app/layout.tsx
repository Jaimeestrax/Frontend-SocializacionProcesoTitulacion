import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";
import { Providers } from "./providers";
import { ToggleMode } from "@/components/toogle-mode";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOPTI",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="w-full flex justify-end px-4 py-4">
              <ToggleMode />
              {/** Solo para desarrollo -> indica los breakpoints */}
              <ScreenSizeIndicator />
            </header>

            <main className="flex-1">
              {children}
            </main>

            <footer className="text-right text-sm py-4 px-4 text-muted-foreground">
              SOPTI-SOFT {new Date().getFullYear()} ©
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
