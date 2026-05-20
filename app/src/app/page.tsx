"use client";

import * as motion from "motion/react-client";
import { ToggleMode } from "@/components/toogle-mode";
import { ScreenSizeIndicator } from "@/components/screen-size-indicator";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Logs, Telescope, Calendar, GraduationCap, LogIn } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetDescription,
    SheetTitle
} from "@/components/ui/sheet";
import { data } from "@/constants/menu-public";
import { useState } from "react";
import { useCursor } from '@/components/cursor-provider';
import ProcessStory from "@/components/process-story";
import { ScrollMarquee } from "@/components/scroll-marquee";
import { useTransform, useScroll } from "motion/react";


export default function InicioPage() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const { setHovered, clearHovered } = useCursor();

    const { scrollYProgress } = useScroll();
    const filter = useTransform(
        scrollYProgress,
        [0, 1],
        ["blur(0px)", "blur(20px)"]
    )

    return (
        <div className="bg-background">
            <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-between px-4 py-4 shrink-0 bg-sidebar backdrop-blur-md border-b border-border">
                <div>
                    <span className="text-primary font-bold text-sm md:text-lg xl:text-xl px-1">
                        SOPTI-SOFT
                    </span>
                </div>

                <div className="flex gap-1">
                    <Button variant="link" className="border-2 border-primary hover:scale-110 transition-all duration-100 hover:cursor-pointer" onClick={() => router.push("/onboarding")}>
                        ¿Eres nuevo por aquí?
                    </Button>
                    <Button variant="link" className="hover:scale-110 transition-all duration-100 hover:cursor-pointer dark:border-0" onClick={() => setIsOpenMenu(true)}>
                        <Logs />
                    </Button>
                    <ToggleMode />
                    {/** Solo para desarrollo -> indica los breakpoints */}
                    <ScreenSizeIndicator />
                </div>
            </header>

            <div className="px-8 py-2 mt-18">
                {/** Hero section  */}
                <section className="flex items-center justify-center p-4" onMouseEnter={() => setHovered('Scroll')} onMouseLeave={clearHovered}>
                    <motion.div style={{ filter }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 items-center">
                            {/** Contenido */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 40
                                }}
                                animate={{
                                    scale: isOpenMenu ? 0.9 : 1,
                                    opacity: isOpenMenu ? 0.7 : 1,
                                    y: 0,
                                }}
                                transition={{
                                    duration: 0.5
                                }}
                                className="space-y-8"
                            >

                                <div className="flex flex-col gap-4">
                                    <motion.h1
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            duration: 1,
                                            delay: 0.2
                                        }}
                                        className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter"
                                    >
                                        <span className="text-primary">Conozca</span>
                                        &nbsp;el proceso de
                                        <span className="text-primary">&nbsp;titulación</span>
                                        <br />
                                        como nunca antes.
                                    </motion.h1>

                                    <motion.p
                                        initial={{
                                            opacity: 0
                                        }}
                                        animate={{
                                            opacity: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                            delay: 0.5
                                        }}
                                        className="text-muted-foreground text-md md:text-lg"
                                    >
                                        Revise cada actividad, requisito y participante mediante una experiencia interactiva diseñada
                                        para resolver sus dudas sobre el proceso de titulación.
                                    </motion.p>
                                </div>

                                {/** BOTONES */}
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.7
                                    }}
                                    className="flex items-center justify-center gap-4"
                                >
                                    <Button variant="default" className="rounded-full text-sm md:text-lg lg:text-xl hover:scale-110 transition-all hover:cursor-pointer" onMouseEnter={() => setHovered('¡Clic!')} onMouseLeave={() => setHovered('Scroll')}>
                                        <Telescope />
                                        Explorar proceso
                                    </Button>

                                    <Button variant="outline" className="rounded-full text-sm md:text-lg lg:text-xl hover:scale-110 transition-all hover:cursor-pointer" onMouseEnter={() => setHovered('¡Clic!')} onMouseLeave={() => setHovered('Scroll')}>
                                        <Calendar />
                                        Ver calendario
                                    </Button>
                                </motion.div>

                            </motion.div>

                            {/** Mascota imagen */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.8
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: [0, -20, 0]
                                }}
                                transition={{
                                    opacity: {
                                        duration: 1
                                    },
                                    scale: {
                                        duration: 1
                                    },
                                    y: {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                                className="relative flex justify-center items-center"
                            >
                                <img src="/images/logo.png" alt="Logo"
                                    className="w-[180px] md:w-[300px] lg:w-[340px] xl:w-[320px] object-contain drop-shadow-2xl"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/** Scrollytelling del proceso */}
                <ProcessStory />

                {/** Cierre */}
                <ScrollMarquee />
            </div>

            {/** Menú lateral */}
            <Sheet open={isOpenMenu} onOpenChange={setIsOpenMenu}>
                <SheetContent className="bg-primary-foreground lg:w-full! lg:max-w-full!">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-1">
                            <GraduationCap className="w-8 h-8" />
                            <span className="text-primary font-bold text-sm md:text-lg xl:text-xl px-1">
                                SOPTI-SOFT
                            </span>
                        </SheetTitle>
                        <SheetDescription className="text-sm md:hidden">
                            Explore las diferentes secciones
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col items-center justify-center h-full px-8 md:px-16">
                        {/** LINKS */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.12
                                    }
                                }
                            }}
                            className="flex flex-col items-center gap-6"
                        >

                            {data.items.map((item) => {
                                const isActive = pathname === item.url

                                return (<motion.button
                                    key={item.title}
                                    onClick={() => { router.push(item.url); setIsOpenMenu(false) }}
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            x: 40
                                        },
                                        visible: {
                                            opacity: 1,
                                            x: 0
                                        }
                                    }}
                                    whileHover={{
                                        x: 20,
                                        scale: 1.03
                                    }}
                                    transition={{
                                        duration: 0.4
                                    }}
                                    className={
                                        `text-5xl md:text-6xl xl:text-7xl font-black tracking-tight
                                        ${isActive ? 'text-primary hover:text-destructive' : 'text-muted-foreground hover:text-primary'}
                                    `}
                                >
                                    {item.title}
                                </motion.button>
                                )
                            })}
                        </motion.div>

                        {/** Imagenes decorativa */}
                        <motion.img
                            src="/images/logo.png"
                            alt="Logo"
                            animate={{
                                y: [0, -20, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="hidden lg:block absolute top-18 left-20 w-[180px] opacity-50 rotate-10"
                        />

                        <motion.img
                            src="/images/logo.png"
                            alt="Logo"
                            animate={{
                                y: [0, -20, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="hidden lg:block absolute bottom-12 right-8 w-[180px] opacity-50 scale-x-[-1]"
                        />
                    </div>
                    <SheetFooter className="w-full md:max-w-sm mx-auto mb-8">
                        <Button variant="default" className="border-2 hover:scale-105 transition-all duration-100 hover:cursor-pointer lg:text-xl"
                            onClick={() => router.push("/auth/sign-in")}>
                            <LogIn className="w-5 h-5" />
                            Iniciar sesión
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}