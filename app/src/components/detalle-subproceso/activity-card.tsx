"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, CircleDashed, Lock, ChevronDown, UserRound, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineInstruments } from "./inline-instruments";

export function ActivityCard({ actividad, isLast, pos, isExpanded, onToggle }: { actividad: any, isLast: boolean, pos: number, isExpanded: boolean, onToggle: () => void }) {
    const isFinalizado = actividad.estadoCalculado === "finalizado";
    const isActivo = actividad.estadoCalculado === "en_proceso";
    const isProximo = actividad.estadoCalculado === "proximo";

    // Propiedades de la card
    let dotColor = "bg-muted border-border text-muted-foreground";
    let cardBorder = "border-border/40";
    let cardBg = "bg-card/40";
    let cardOpacity = "opacity-100";
    let badge = null;

    if (isFinalizado) {
        dotColor = "bg-success border-success-foreground text-success-foreground";
        cardBorder = "border-success-foreground";
        cardBg = "bg-success";
    } else if (isActivo) {
        dotColor = "bg-warning/25 border-warning text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]";
        cardBorder = "border-warning shadow-sm shadow-warning/25";
        cardBg = "bg-warning/25";
        badge = (
            <span className="absolute -top-3 right-6 bg-amber-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                En proceso
            </span>
        );
    } else if (isProximo) {
        dotColor = "bg-destructive/50 border-destructive text-destructive";
        cardBorder = "border-destructive";
        cardBg = "bg-destructive/50";
        cardOpacity = "opacity-60 grayscale-[0.3]";
    }

    const formatearFecha = (fecha: any) => {
        if (!fecha) return "S/N";
        return new Date(fecha).toLocaleDateString("es-EC", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className={`relative flex items-start gap-6 ${cardOpacity}`}>
            {/* Linea de tiempo */}
            <div className="relative z-10 shrink-0 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors bg-background ${dotColor}`}>
                    {isFinalizado && <CheckCircle2 className="w-4 h-4" />}
                    {isActivo && <CircleDashed className="w-4 h-4 animate-[spin_4s_linear_infinite]" />}
                    {isProximo && <Lock className="w-4 h-4" />}
                </div>
                {!isLast && (
                    <div className={`w-px h-full min-h-[50px] my-2 ${isFinalizado ? 'bg-success-foreground' : 'bg-border/60'}`} />
                )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className={`relative flex-1 rounded-3xl border backdrop-blur-sm p-6 mb-8 transition-all duration-300 ${cardBorder} ${cardBg}`}>
                {badge}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            Actividad {pos + 1}
                        </p>
                        <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight mb-2 ${isActivo ? 'text-foreground' : ''}`}>
                            {actividad.nombre}
                        </h3>
                        <p className="text-sm text-secondary-foreground line-clamp-2 md:line-clamp-none max-w-2xl">
                            {actividad.descripcion}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full md:w-auto"
                            onClick={onToggle}
                        >
                            Ver detalles
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-4 h-4 ml-2" />
                            </motion.div>
                        </Button>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 space-y-8 border-t border-border/50 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Participantes */}
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-foreground mb-3">
                                            Participantes
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-2 bg-background border border-border/60 px-3 py-2 rounded-full shadow-sm">
                                                <UserRound className="w-5 h-5 text-primary" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-foreground leading-none">{actividad.idParticipante.nombre}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Fechas */}
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-foreground mb-3">
                                            Fechas de la actividad
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="flex items-center gap-2 bg-background border border-border/60 px-4 py-2 rounded-full shadow-sm">
                                                <CalendarIcon className="w-5 h-5 text-primary" />
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-bold text-foreground leading-none">
                                                        Fecha inicio: <span className="text-xs font-normal">{formatearFecha(actividad.fechaInicio)}</span>
                                                    </p>
                                                    <p className="text-xs font-bold text-foreground leading-none">
                                                        Fecha de fin: <span className="text-xs font-normal">{formatearFecha(actividad.fechaFin)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Instrumentos */}
                                <InlineInstruments instrumentos={actividad.instrumentos} estadoSubproceso={actividad.estadoCalculado} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
