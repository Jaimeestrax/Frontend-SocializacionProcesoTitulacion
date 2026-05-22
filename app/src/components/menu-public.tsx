"use client";

import * as motion from "motion/react-client";

import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetDescription,
    SheetTitle
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { GraduationCap, LogIn } from "lucide-react";

import { data } from "@/constants/menu-public";
import { useRouter, usePathname } from "next/navigation";

interface MenuPublicProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function MenuPublic({
    open,
    onOpenChange
}: MenuPublicProps) {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                                onClick={() => { router.push(item.url); onOpenChange(false) }}
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
    );
}