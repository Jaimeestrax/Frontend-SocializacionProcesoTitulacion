"use client";

import { motion } from "motion/react";
import { Calendar, CircleDashed, CheckCircle2 } from "lucide-react";

export function SubprocessHeader({ data = null }: { data: any }) {
    if (!data) return;

    const isFinalizado = data.estadoCalculado === "finalizado";
    const isActivo = data.estadoCalculado === "en_proceso";

    // Circle progress variables
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (data.porcentajeCompletado / 100) * circumference;

    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    {/* Badge de estado */}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border
                        ${isActivo ? 'bg-warning/25 text-amber-500 border-warning' : isFinalizado ? 'bg-success text-success-foreground border-success-foreground' : 'bg-destructive/25 text-destructive border-destructive'}`}>
                        {isActivo && <CircleDashed className="w-4 h-4 animate-[spin_4s_linear_infinite]" />}
                        {isFinalizado && <CheckCircle2 className="w-4 h-4" />}
                        {data.estadoCalculado.replace("_", " ")}
                    </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                    {data.nombre}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-primary">
                    <span className="flex items-center gap-1 bg-muted/40 px-3 py-1.5 rounded-lg border border-border">
                        <Calendar className="w-4 h-4" />
                        Desde el {new Date(data.fechaInicio).toLocaleDateString('es-EC', { day: '2-digit', month: 'long' })} hasta el {new Date(data.fechaFin).toLocaleDateString('es-EC', { day: '2-digit', month: 'long' })}
                    </span>
                </div>
            </div>

            {/* Indicador de progreso circular */}
            <div className="shrink-0 flex items-center justify-center p-6 bg-card/40 backdrop-blur-md rounded-3xl border border-border/60 shadow-lg relative overflow-hidden">
                {/* Difuminados en los costados */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 -translate-x-1 -translate-y-1 w-15 h-15 bg-primary rounded-full blur-2xl" />

                <div className="relative w-[100px] h-[100px]">
                    <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            className="text-muted"
                        />
                        <motion.circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            className="text-primary"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black tabular-nums">{data.porcentajeCompletado}%</span>
                    </div>
                </div>
                <div className="ml-5 uppercase font-black">
                    <p className="text-xs tracking-widest text-muted-foreground">Actividades</p>
                    <p className="text-sm md:text-base leading-tight">completadas</p>
                </div>
            </div>
        </div>
    );
}
