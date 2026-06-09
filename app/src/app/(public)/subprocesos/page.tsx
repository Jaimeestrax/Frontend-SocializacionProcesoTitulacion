"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarClock } from "lucide-react";

import { TimelineVertical } from "@/components/subprocesos/timeline-vertical";

import { usePlanificacion } from "@/hooks/use-planificacion";

export default function SubprocesosCalendarPage() {
    // Hooks de planificacion
    const { obtenerSubprocesosPlanificacionVigente, obtenerPeriodoActual, obtenerCodigoPAO, loading } = usePlanificacion();
    const [filtroEstado, setFiltroEstado] = useState<string>("todos");
    const [subprocesosVigentes, setSubprocesosVigentes] = useState<any>(null);
    const [periodoActual, setPeriodoActual] = useState<any>(null);
    const [codigoPAO, setCodigoPAO] = useState<any>(null);

    const cargarDatos = async () => {
        try {
            const res = await obtenerSubprocesosPlanificacionVigente();
            setSubprocesosVigentes(res.data);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener los subprocesos:", error.message);
            //toast.error(error.message);
        }
        try {
            const res = await obtenerPeriodoActual();
            setPeriodoActual(res.data);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener el periodo actual:", error.message);
            //toast.error(error.message);
        }
        try {
            const res = await obtenerCodigoPAO();
            setCodigoPAO(res.data);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener el código PAO:", error.message);
            //toast.error(error.message);
        }
    };

    useEffect(() => { cargarDatos(); }, []);

    // Filtrar subprocesos por tab activo
    const subprocesosFiltrados = useMemo(() => {
        if (!subprocesosVigentes) return [];

        let res = subprocesosVigentes;

        if (filtroEstado !== "todos") {
            res = res.filter((s: any) => s.estadoCalculado === filtroEstado);
        }

        return res;
    }, [filtroEstado, subprocesosVigentes]);

    const filterOptions: { value: string, label: string }[] = [
        { value: "todos", label: "Todos" },
        { value: "finalizado", label: "Finalizados" },
        { value: "en_proceso", label: "En proceso" },
        { value: "proximo", label: "Próximos" }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">

            {/* Encabezado */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold uppercase text-primary bg-primary/10 px-3 py-2 rounded-full border border-primary mb-4 hover:scale-105 transition-transform duration-200 cursor-none">
                        <span className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                        {codigoPAO}
                    </span>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight mb-3">
                        Periodo académico: {periodoActual}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Visualize el cronograma de actividades para el periodo vigente.
                    </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-sm font-medium text-primary bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                    <CalendarClock className="w-5 h-5" />
                    Fecha actual: {new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sticky top-20 z-40 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-border/40 shadow-sm">

                <div className="flex p-1 bg-muted/40 border border-border/50 rounded-xl w-full lg:w-auto overflow-x-auto">
                    {filterOptions.map((opt) => {
                        const isActive = filtroEstado === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setFiltroEstado(opt.value)}
                                className={`relative px-5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap hover:cursor-pointer ${isActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border/50"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Timeline Principal */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={filtroEstado}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <TimelineVertical subprocesos={subprocesosFiltrados} />
                </motion.div>
            </AnimatePresence>

        </div>
    );
}
