"use client";

import { motion } from "motion/react";
import { FileCheck, Calendar, Users, Monitor, GraduationCap, ClipboardList, Clock } from "lucide-react";

interface MarqueeItem {
    text: string;
    icon: React.ReactNode;
}

const row1: MarqueeItem[] = [
    { text: "Requisitos", icon: <FileCheck className="w-5 h-5" /> },
    { text: "Subprocesos", icon: <ClipboardList className="w-5 h-5" /> },
    { text: "Calendario", icon: <Calendar className="w-5 h-5" /> },
    { text: "Participantes", icon: <Users className="w-5 h-5" /> }
];

const row2: MarqueeItem[] = [
    { text: "Sustentación", icon: <Monitor className="w-5 h-5" /> },
    { text: "Titulación", icon: <GraduationCap className="w-5 h-5" /> },
    { text: "Plazos", icon: <Clock className="w-5 h-5" /> },
    { text: "Documentación", icon: <FileCheck className="w-5 h-5" /> }
];


// Función para animación
function MarqueeRow({
    items,
    direction,
    duration,
}: {
    items: MarqueeItem[];
    direction: "left" | "right";
    duration: number;
}) {
    // Cuadruplica para bucle sin interrupciones
    const looped = [...items, ...items, ...items, ...items];
    const xFrom = direction === "left" ? "0%" : "-50%";
    const xTo = direction === "left" ? "-50%" : "0%";

    return (
        <div className="overflow-hidden py-3 mask-x-fade">
            <motion.div
                className="inline-flex items-center gap-8 whitespace-nowrap"
                animate={{ x: [xFrom, xTo] }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
            >
                {looped.map((item, i) => (
                    <span
                        key={i}
                        className={`inline-flex items-center gap-3 shrink-0 ${i % 2 === 0
                            ? "text-foreground"
                            : "text-primary"
                            }`}
                    >
                        <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter">
                            {item.text}
                        </span>
                        <span className="w-5 h-5">{item.icon}</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}


export default function ScrollMarquee() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Efecto de desvanecido en los bordes laterales */}
            <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none bg-linear-to-r from-background to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none bg-linear-to-l from-background to-transparent" />

            {/* Header de la sección */}
            <motion.div
                className="text-center mb-14 px-4 relative z-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    Todo el proceso, en un vistazo
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mt-2">
                    Encuentra
                    <span className="text-primary">&nbsp;lo que necesites</span>
                </h2>
            </motion.div>

            {/* Presentación de marquees */}
            <div className="-rotate-1 relative z-0">
                <MarqueeRow items={row1} direction="left" duration={28} />
                <MarqueeRow items={row2} direction="right" duration={35} />
            </div>
        </section>
    );
}