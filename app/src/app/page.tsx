"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Telescope, Newspaper } from "lucide-react";
import { useState } from "react";
import { useCursor } from "@/components/cursor-provider";
import ProcessStory from "@/components/process-story";
import { ScrollMarquee } from "@/components/scroll-marquee";
import { PeriodDashboard } from "@/components/period-dashboard";
import { CTASection } from "@/components/cta-section";
import { ClosingSection } from "@/components/closing-section";
import { LenisProvider } from "@/components/lenis-provider";
import { useTransform, useScroll } from "motion/react";
import HeaderPublic from "@/components/header-public";
import MenuPublic from "@/components/menu-public";
import { ChatbotButton } from "@/components/chatbot-button";

export default function InicioPage() {
    const router = useRouter();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const { setHovered, clearHovered } = useCursor();

    const { scrollYProgress } = useScroll();
    const filter = useTransform(
        scrollYProgress,
        [0, 1],
        ["blur(0px)", "blur(20px)"]
    );

    return (
        <LenisProvider>
            <div className="bg-background">
                <HeaderPublic onOpenMenu={() => setIsOpenMenu(true)} onGoToOnboarding={() => router.push("/onboarding")} />

                {/* Hero section */}
                <div className="px-8 py-2 mt-20">
                    <section className="flex items-center justify-center p-4" onMouseEnter={() => setHovered("Scroll")}
                        onMouseLeave={clearHovered}>
                        <motion.div style={{ filter }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 items-center">
                                {/* Contenido */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{
                                        scale: isOpenMenu ? 0.9 : 1,
                                        opacity: isOpenMenu ? 0.7 : 1,
                                        y: 0,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col gap-4">
                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter"
                                        >
                                            <span className="text-primary">Conozca</span>
                                            &nbsp;el proceso de
                                            <span className="text-primary">&nbsp;titulación</span>
                                            <br />
                                            como nunca antes.
                                        </motion.h1>

                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="text-muted-foreground text-md md:text-lg"
                                        >
                                            Revise cada actividad, requisito y participante mediante
                                            una experiencia interactiva diseñada para resolver sus
                                            dudas sobre el proceso de titulación.
                                        </motion.p>
                                    </div>

                                    {/* Botones */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                        className="flex items-center justify-center gap-4"
                                    >
                                        <Button
                                            variant="default"
                                            className="rounded-full text-sm md:text-lg lg:text-xl hover:scale-110 transition-all hover:cursor-pointer"
                                            onMouseEnter={() => setHovered("¡Clic!")}
                                            onMouseLeave={() => setHovered("Scroll")}
                                            onClick={() => {
                                                router.push("/subprocesos")
                                                clearHovered()
                                            }}
                                        >
                                            <Telescope />
                                            Explorar calendario
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="rounded-full text-sm md:text-lg lg:text-xl hover:scale-110 transition-all hover:cursor-pointer"
                                            onMouseEnter={() => setHovered("¡Clic!")}
                                            onMouseLeave={() => setHovered("Scroll")}
                                            onClick={() => {
                                                router.push("/noticias")
                                                clearHovered()
                                            }}
                                        >
                                            <Newspaper />
                                            Últimas noticias
                                        </Button>
                                    </motion.div>
                                </motion.div>

                                {/* Mascota imagen */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [0, -20, 0],
                                    }}
                                    transition={{
                                        opacity: { duration: 1 },
                                        scale: { duration: 1 },
                                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                    }}
                                    className="relative flex justify-center items-center"
                                >
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo"
                                        className="w-[180px] md:w-[300px] lg:w-[340px] xl:w-[320px] object-contain drop-shadow-2xl"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </section>
                </div>

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

                {/* Menú lateral para mobile */}
                <MenuPublic open={isOpenMenu} onOpenChange={setIsOpenMenu} />

                {/* Botón flotante chatbot */}
                <div className="fixed bottom-10 right-10">
                    <ChatbotButton />
                </div>
            </div>
        </LenisProvider>
    );
}