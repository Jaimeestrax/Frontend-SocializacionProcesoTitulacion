import { motion } from "motion/react";
import { ActivityCard } from "./activity-card";
import { useState, useEffect } from "react";

export function ActivityTimeline({ data = null }: { data: any }) {
    // Extracción de actividades
    const actividades = data?.actividades || [];

    // Estado para saber la posicion abierta (-1 es ninguna)
    const [activePos, setActivePos] = useState<number>(-1);

    // Abrir por defecto la que este en proceso
    useEffect(() => {
        const indexActivo = actividades.findIndex(
            (act: any) => act.estadoCalculado === "en_proceso"
        );
        if (indexActivo !== -1) {
            setActivePos(indexActivo);
        }
    }, [data]);

    return (
        <div className="mt-8 relative">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                Timeline de Actividades
            </h2>

            {actividades.length > 0 ? (
                <div className="relative">
                    {/* Línea vertical principal */}
                    <div className="absolute left-[15px] top-4 bottom-0 w-px bg-border/60 z-0" />

                    <div className="space-y-0">
                        {data.actividades.map((actividad: any, i: number) => (
                            <motion.div
                                key={actividad._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.25, delay: i * 0.1 }}
                            >
                                <ActivityCard
                                    actividad={actividad}
                                    isLast={i === data.actividades.length - 1}
                                    pos={i}
                                    isExpanded={activePos === i}
                                    onToggle={() => setActivePos(activePos === i ? -1 : i)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-muted-foreground">No se encontraron actividades registradas</p>
            )}
        </div>
    );
}
