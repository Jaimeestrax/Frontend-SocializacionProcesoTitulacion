"use client";

import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Telescope, Newspaper, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCursor } from "@/components/cursor-provider";
import { useScroll, useTransform } from "motion/react";

import { usePlanificacion } from "@/hooks/use-planificacion";
import { environment } from "@/lib/api/client";

export default function HeroSection({ isOpenMenu }: { isOpenMenu: boolean }) {
    const router = useRouter();

    const { obtenerPlanificacionVigente, loading } = usePlanificacion();
    const [planificacionVigente, setPlanificacionVigente] = useState<any>(null);

    const { setHovered, clearHovered } = useCursor();

    const [imagenExpandida, setImagenExpandida] = useState(false);

    const { scrollYProgress } = useScroll();
    const filter = useTransform(
        scrollYProgress,
        [0, 1],
        ["blur(0px)", "blur(20px)"]
    );

    const cargarPlanificacionVigente = async () => {
        try {
            const res = await obtenerPlanificacionVigente();
            setPlanificacionVigente(res.data);
        } catch (error: any) {
            console.error("Error al obtener planificación vigente:", error.message);
        }
    }

    useEffect(() => {
        cargarPlanificacionVigente();
    }, []);

    return (
        <div className="px-8 py-2 mt-20">
            <section className="flex items-center justify-center p-4">
                <motion.div style={{ filter }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
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
                            onMouseEnter={() => setHovered("Scroll")} onMouseLeave={clearHovered}
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

                        {/* Imagen resumen del proceso */}
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
                            className="relative flex justify-center items-center mt-8"
                            onMouseEnter={() => setHovered("¡Clic!")} onMouseLeave={clearHovered}
                        >
                            {planificacionVigente && (
                                <motion.img src={`${environment.baseUrl}/${planificacionVigente.imagenProceso}`} alt="Proceso"
                                    onClick={() => setImagenExpandida(true)}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-[600px] xl:w-[750px] object-contain drop-shadow-xl rounded-xl cursor-pointer"
                                />
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </section>
            {/* Modal imagen expandida */}
            {imagenExpandida && planificacionVigente && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
                    onClick={() => setImagenExpandida(false)}
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-6xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <Button onClick={() => setImagenExpandida(false)}
                            onMouseEnter={() => setHovered("¡Clic!")}
                            onMouseLeave={() => clearHovered()}
                            className="absolute -top-4 -right-4 bg-muted text-primary rounded-full p-2 shadow-lg hover:scale-110 transition cursor-pointer"
                        >
                            <X size={22} />
                        </Button>

                        <img src={`${environment.baseUrl}/${planificacionVigente.imagenProceso}`} alt="Proceso ampliado"
                            className="max-h-[90vh] w-auto rounded-xl shadow-2xl"
                        />

                    </motion.div>
                </motion.div>
            )}
        </div>
    );

}