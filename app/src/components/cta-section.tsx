"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Telescope, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCursor } from "@/components/cursor-provider";


export function CTASection() {
    const router = useRouter();
    const { setHovered, clearHovered } = useCursor();

    return (
        <section className="relative py-40 px-6 overflow-hidden bg-linear-to-br from-indigo-500/15 via-blue-500/5 to-transparent">
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary/8 px-4 py-2 rounded-full border border-primary/15 mb-10">
                        <Sparkles className="w-4 h-4" />
                        Tu camino comienza aquí
                    </span>

                    <h2 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.92] mb-7">
                        ¿Listo para conocer{" "}
                        <br className="hidden sm:block" />
                        tu{" "}
                        <span className="text-primary">camino</span>{" "}
                        hacia la
                        <br className="hidden sm:block" />
                        titulación?
                    </h2>

                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14">
                        Explora el sistema de socialización del proceso de titulación.
                        Todo lo que necesitas en un solo lugar.
                    </p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                    >
                        <Button id="cta-explorar" size="lg"
                            className="rounded-full text-base md:text-lg px-6 py-4 h-auto
                                hover:scale-105 hover:shadow-2xl hover:shadow-primary
                                transition-all duration-300 hover:cursor-pointer"
                            onMouseEnter={() => setHovered("¡Clic!")}
                            onMouseLeave={() => clearHovered()}
                            onClick={() => {
                                router.push("/subprocesos")
                                clearHovered()
                            }}
                        >
                            <Telescope className="w-5 h-5" />
                            Explorar calendario
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
