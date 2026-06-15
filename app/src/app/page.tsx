"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ProcessStory from "@/components/process-story";
import ScrollMarquee from "@/components/scroll-marquee";
import PeriodDashboard from "@/components/period-dashboard";
import CTASection from "@/components/cta-section";
import ClosingSection from "@/components/closing-section";
import { LenisProvider } from "@/components/lenis-provider";
import HeaderPublic from "@/components/header-public";
import MenuPublic from "@/components/menu-public";
import ChatbotButton from "@/components/chatbot-button";
import HeroSection from "@/components/hero-section";

export default function InicioPage() {
    const router = useRouter();
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    return (
        <LenisProvider>
            <a href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-9999 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg">
                Saltar al contenido principal
            </a>
            <div className="bg-background">
                <main id="main-content">
                    <HeaderPublic onOpenMenu={() => setIsOpenMenu(true)} onGoToOnboarding={() => router.push("/onboarding")} />

                    {/* Hero section -> props de menu para que en pantallas pequeñas haga un efecto si se abre el menu */}
                    <HeroSection isOpenMenu={isOpenMenu} />

                    {/** Scrollytelling del proceso */}
                    <ProcessStory />

                    {/** Marquee institucional */}
                    <ScrollMarquee />

                    {/** Dashboard del período actual */}
                    <PeriodDashboard />

                    {/** CTA principal */}
                    <CTASection />

                    {/** Cierre visual */}
                    <ClosingSection />
                </main>

                {/* Menú lateral para mobile */}
                <MenuPublic open={isOpenMenu} onOpenChange={setIsOpenMenu} />

                <ChatbotButton />
            </div>
        </LenisProvider>
    );
}