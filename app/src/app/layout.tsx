import type { Metadata } from "next";
import type { Viewport } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

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
      <body className="h-full">
        <Providers>
          {children}
          <Toaster expand visibleToasts={1} />
        </Providers>
      </body>
    </html>
  );
}
