"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { TrendingUp, Target, CalendarClock, Clock9 } from "lucide-react";

import { usePlanificacion } from "@/hooks/use-planificacion";


interface CircularProgressProps {
    progress: number; // 0-100
    isInView: boolean;
}

function CircularProgress({ progress, isInView }: CircularProgressProps) {
    const R = 60;
    const SIZE = 160;
    const STROKE = 10;
    const circumference = 2 * Math.PI * R;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="-rotate-90"
            >
                {/* Track */}
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={STROKE}
                    className="text-muted"
                />
                {/* Fill */}
                <motion.circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    className="text-primary"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{
                        strokeDashoffset: isInView ? offset : circumference,
                    }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                />
            </svg>
            {/* Centre label */}
            <div className="absolute flex items-center">
                <motion.span
                    className="text-2xl font-black tracking-tight text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isInView ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    {progress}%
                </motion.span>
            </div>
        </div>
    );
}

function Digit({ value }: { value: string }) {
    return (
        <div className="relative w-7 h-10 bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-center overflow-hidden shadow-inner font-mono text-xl font-black text-primary">
            <motion.span
                key={value}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute"
            >
                {value}
            </motion.span>
        </div>
    );
}

export function PeriodDashboard() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    const { obtenerPeriodoActual, obtenerPorcentajeAvance, obtenerProximasActividades, loading } = usePlanificacion();
    const [periodoActual, setPeriodoActual] = useState<any>(null);
    // Porcentaje de avance de las actividades sobre el total de las mismas
    const [porcentajeAvance, setPorcentajeAvance] = useState<number>(0);
    // Próximas actividades pendientes
    const [proximasActividades, setProximasActividades] = useState<any[]>([]);
    // Calcular tiempo restante para proximo subproceso
    const [tiempoRestante, setTiempoRestante] = useState<string>("00-00-00-00");

    const cargarDatos = async () => {
        // Cargar periodo actual
        try {
            const respuestaPeriodoActual = await obtenerPeriodoActual();
            setPeriodoActual(respuestaPeriodoActual.data);
            //toast.success(respuestaActual.message);
        } catch (error: any) {
            console.error("Error al cargar periodo actual:", error.message);
            //toast.error(error.message);
        }

        //Cargar porcentaje de avance
        try {
            const respuestaPorcentajeAvance = await obtenerPorcentajeAvance();
            setPorcentajeAvance(respuestaPorcentajeAvance.data);
            //toast.success(respuestaPorcentajeAvance.message);
        } catch (error: any) {
            console.error("Error al cargar porcentaje de avance:", error.message);
            //toast.error(error.message);
        }

        //Cargar próximas actividades pendientes
        try {
            const respuestaProximasActividades = await obtenerProximasActividades();
            setProximasActividades(respuestaProximasActividades.data);
            //toast.success(respuestaProximasActividades.message);
        } catch (error: any) {
            console.error("Error al cargar próximas actividades pendientes:", error.message);
            //toast.error(error.message);
        }
    }

    useEffect(() => {
        try {
            cargarDatos();
            //toast.success("Información cargada exitosamente");
        } catch (error: any) {
            console.error("Error al cargar información de inicio:", error.message);
            //toast.error(error.message);
        }
    }, []);

    useEffect(() => {
        // Función para calcular tiempo restante
        const calcularTiempo = () => {
            if (!proximasActividades || proximasActividades.length === 0) {
                setTiempoRestante("");
                return;
            }

            const fechaTexto = proximasActividades[0].fechaInicio.split("T")[0];
            const [anio, mes, dia] = fechaTexto.split("-").map(Number);
            const fechaInicio = new Date(anio, mes - 1, dia);

            const ahora = new Date();
            const diff = fechaInicio.getTime() - ahora.getTime();

            if (diff <= 0) {
                setTiempoRestante("00:00:00");
                return;
            }

            const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
            const horas = Math.floor(diff / (1000 * 60 * 60));
            const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);

            setTiempoRestante(
                `${String(dias).padStart(2, "0")}-${String(horas).padStart(2, "0")}-${String(minutos).padStart(2, "0")}-${String(segundos).padStart(2, "0")}`
            );
        };

        calcularTiempo();
        const intervalo = setInterval(calcularTiempo, 1000); // Actualiza cada segundo
        return () => clearInterval(intervalo);
    }, [proximasActividades]);

    const formatearFecha = (fecha: any) => {
        if (!fecha) return "S/N";
        //return fecha.split("T")[0];
        return new Date(fecha).toLocaleDateString("es-EC", {
            timeZone: "UTC", // Evita desfase UTC
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <section ref={sectionRef} className="py-10 px-6 md:px-12 xl:px-20">
            {/* Header */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary bg-primary/8 px-4 py-2 rounded-full border border-primary/15 mb-4">
                    <CalendarClock className="w-5 h-5" />
                    Período académico
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mt-3">
                    {periodoActual}
                </h2>
                <p className="text-muted-foreground mt-3 text-base md:text-lg">
                    Estado actual del proceso de titulación en la carrera
                </p>
            </motion.div>

            {/* Cards informativas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">

                {/* Card 1: Progreso del proceso */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="relative p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm
                        shadow-xl shadow-black/5 dark:shadow-black/20 hover:scale-105 transition-shadow duration-500 overflow-hidden"
                >
                    {/* Titulo */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                            Avance del período actual
                        </span>
                    </div>

                    <div className="flex flex-col items-center">
                        <CircularProgress progress={porcentajeAvance} isInView={isInView} />
                        <p className="text-xs lg:text-sm text-primary">
                            Porcentaje de actividades que ya han sido completadas
                        </p>
                    </div>
                </motion.div>

                {/* Card 2: Contador próxima actividad */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="relative p-8 md:p-10 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm
                        shadow-xl shadow-black/5 dark:shadow-black/20 hover:scale-105 transition-shadow duration-500 overflow-hidden"
                >
                    {/* Titulo */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-warning/25 blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-amber-500" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                            Próxima actividad
                        </span>
                    </div>

                    {proximasActividades && proximasActividades.length > 0 ? (
                        <>
                            <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">
                                {proximasActividades[0].nombre}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-1">
                                {proximasActividades[0].descripcion}
                            </p>
                            <p className="text-xs font-semibold text-primary mb-8 flex items-center gap-1.5">
                                <CalendarClock className="w-3 h-3" />
                                {formatearFecha(proximasActividades[0].fechaInicio)}
                            </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground text-sm italic mb-8">
                            No hay actividades pendientes programadas.
                        </p>
                    )}

                    {/* Countdown */}
                    <div className="mt-4 pt-4 border-t border-border/40">
                        {tiempoRestante ? (
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    <Clock9 size={12} className="text-amber-500" /> Tiempo restante
                                </span>

                                <div className="flex items-start gap-2 select-none">
                                    {/* DÍAS */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex gap-0.5">
                                            <Digit value={tiempoRestante.split("-")[0][0]} />
                                            <Digit value={tiempoRestante.split("-")[0][1]} />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Días</span>
                                    </div>

                                    <span className="text-primary/70 font-bold animate-pulse pt-1.5">:</span>

                                    {/* HORAS */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex gap-0.5">
                                            <Digit value={tiempoRestante.split("-")[1][0]} />
                                            <Digit value={tiempoRestante.split("-")[1][1]} />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Horas</span>
                                    </div>

                                    <span className="text-primary/70 font-bold animate-pulse pt-1.5">:</span>

                                    {/* MINUTOS */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex gap-0.5">
                                            <Digit value={tiempoRestante.split("-")[2][0]} />
                                            <Digit value={tiempoRestante.split("-")[2][1]} />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Min</span>
                                    </div>

                                    <span className="text-primary/70 font-bold animate-pulse pt-1.5">:</span>

                                    {/* SEGUNDOS */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex gap-0.5">
                                            <Digit value={tiempoRestante.split("-")[3][0]} />
                                            <Digit value={tiempoRestante.split("-")[3][1]} />
                                        </div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Seg</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-sm font-medium text-muted-foreground italic">
                                Sin actividades pendientes.
                            </span>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
