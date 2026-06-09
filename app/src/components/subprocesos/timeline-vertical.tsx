"use client";

import { motion } from "motion/react";
import { useCursor } from "@/components/cursor-provider";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleDashed, Lock, Clock, Calendar } from "lucide-react";

export function TimelineVertical({ subprocesos = [] }: { subprocesos: any[] }) {
    const router = useRouter();
    const { setHovered, clearHovered } = useCursor();

    if (subprocesos.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-muted-foreground">No se encontraron subprocesos para este filtro.</p>
            </div>
        );
    }

    return (
        <div className="relative max-w-4xl mx-auto pl-4 md:pl-0 mt-8">
            {/* Línea izquierda */}
            <div className="absolute left-8 md:left-12 top-4 bottom-4 w-px bg-border/60" />

            <div className="space-y-12">
                {subprocesos.map((sub: any, i: number) => {
                    const isFinalizado = sub.estadoCalculado === "finalizado";
                    const isActivo = sub.estadoCalculado === "en_proceso";
                    const isProximo = sub.estadoCalculado === "proximo";

                    // Estilos dinámicos según estado
                    let dotColor = "bg-muted border-border text-muted-foreground";
                    let cardBorder = "border-border/40";
                    let cardBg = "bg-card/40";
                    let cardOpacity = "opacity-100";
                    let badge = null;

                    if (isFinalizado) {
                        dotColor = "bg-success border-success text-success-foreground";
                        cardBorder = "border-success";
                        cardBg = "bg-success/25";
                    } else if (isActivo) {
                        dotColor = "bg-warning/25 border-warning/50 text-warning shadow-2xl";
                        cardBorder = "border-warning/50 shadow-2xl shadow-warning/25";
                        cardBg = "bg-warning/25";
                        badge = (
                            <span className="absolute -top-3 right-6 bg-warning text-secondary text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                Activo Ahora
                            </span>
                        );
                    } else if (isProximo) {
                        dotColor = "bg-destructive/25 border-destructive/25 text-destructive";
                        cardBorder = "border-destructive/25";
                        cardBg = "bg-destructive/10";
                        cardOpacity = "opacity-80";
                    }

                    // Progreso de actividades
                    const pct = sub.actividadesTotales > 0 ? Math.round((sub.actividadesCompletadas / sub.actividadesTotales) * 100) : 0;

                    // Calculo de semanas
                    const fInicio = new Date(sub.fechaInicio);
                    const fFin = new Date(sub.fechaFin);
                    const diferenciaTiempo = Math.abs(fFin.getTime() - fInicio.getTime());
                    const semanasCalculadas = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24 * 7));

                    return (
                        <motion.div
                            key={sub._id}
                            id={sub._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                            className={`relative flex items-start gap-6 md:gap-10 ${cardOpacity}`}
                        >
                            {/* Dot en la línea temporal */}
                            <div className="relative z-10 shrink-0 mt-6 md:ml-8">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-colors ${dotColor}`}>
                                    {isFinalizado && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />}
                                    {isActivo && <CircleDashed className="w-4 h-4 md:w-5 md:h-5 animate-[spin_4s_linear_infinite]" />}
                                    {isProximo && <Lock className="w-4 h-4 md:w-4 md:h-4" />}
                                </div>
                            </div>

                            {/* Tarjeta de contenido */}
                            <div className={`group relative flex-1 rounded-3xl border backdrop-blur-sm p-6 md:p-8 transition-all duration-300 ${cardBorder} ${cardBg} ${isProximo ? 'cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-lg hover:cursor-pointer'}`}
                                onMouseEnter={!isProximo ? () => setHovered("¡Clic!") : undefined}
                                onMouseLeave={!isProximo ? clearHovered : undefined}
                                onClick={!isProximo ? () => {
                                    router.push(`/subprocesos/detalle-subproceso/${sub._id}`);
                                    clearHovered();
                                } : undefined}
                            >
                                {badge}

                                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    Subproceso {sub.identificador}
                                                </span>
                                            </div>
                                            <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight ${isActivo ? 'text-foreground' : ''}`}>
                                                {sub.nombre}
                                            </h3>
                                        </div>

                                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                            {sub.descripcion}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 md:gap-5">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(sub.fechaInicio).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })} — {new Date(sub.fechaFin).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                                                <Clock className="w-4 h-4" />
                                                {semanasCalculadas} {semanasCalculadas === 1 ? 'semana' : 'semanas'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    <div className="w-full xl:w-64 shrink-0 bg-background/50 rounded-2xl p-5 border border-border/50">
                                        <div className="flex justify-between items-end mb-3">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                                                    Progreso
                                                </p>
                                                <p className="text-xs font-medium">
                                                    <span className={isActivo ? "text-amber-600 font-bold" : "text-foreground"}>
                                                        {sub.actividadesCompletadas}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {" "}de {sub.actividadesTotales} actividades.
                                                    </span>
                                                </p>
                                            </div>
                                            <span className="text-2xl font-black tabular-nums">
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                                                className={`h-full rounded-full ${isFinalizado ? 'bg-success-foreground' : isActivo ? 'bg-warning' : 'bg-muted-foreground/30'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
