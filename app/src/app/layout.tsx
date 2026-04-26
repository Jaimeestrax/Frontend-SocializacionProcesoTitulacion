import type { Metadata } from "next";
import type { Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";
import { AuthProvider } from "@/context/AuthContext";
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
      <body className="bg-background text-foreground">
        <AuthProvider>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <header className="w-full flex justify-between px-4 py-4">
                <div>
                  <span className="text-primary font-bold text-sm md:text-lg xl:text-xl md:hidden">
                    SOPTI-SOFT
                  </span>
                </div>

                <div className="flex">
                  <ToggleMode />
                  {/** Solo para desarrollo -> indica los breakpoints */}
                  <ScreenSizeIndicator />
                </div>
              </header>

              <main className="flex-1">
                {children}
              </main>

              <footer className="text-right text-sm py-4 px-4 text-muted-foreground">
                Socialización del Proceso de Titulación {new Date().getFullYear()} ©
              </footer>
            </div>
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
