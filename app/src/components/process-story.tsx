"use client";

import { useRef, useState, useEffect } from "react";

import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useMotionValueEvent,
} from "motion/react";

import { useCursor } from "@/components/cursor-provider";

import { usePlanificacion } from "@/hooks/use-planificacion";
import { MapPin, Check, Clock, UserRound } from "lucide-react";

import * as LucideIcons from "lucide-react";
import { mapSubprocesosPasos } from "@/constants/pasos-storytelling";

export default function ProcessStory() {
    const { obtenerSubprocesosPlanificacionVigente, loading } = usePlanificacion();
    const [subprocesos, setSubprocesos] = useState<any[]>([]);
    const [activeStep, setActiveStep] = useState(0);

    const { setHovered, clearHovered } = useCursor();

    const obtenerSubprocesosPlanificacion = async () => {
        try {
            const res = await obtenerSubprocesosPlanificacionVigente();
            if (res?.data) {
                // Integramos la función de mapeo estructurada
                const pasosMapeados = mapSubprocesosPasos(res.data);
                setSubprocesos(pasosMapeados);
            }
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener subprocesos de la planificacion:", error.message);
            //toast.error(error.message);
        }
    };

    useEffect(() => {
        obtenerSubprocesosPlanificacion();
    }, []);

    const headerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress: headerProgress } = useScroll({
        target: headerRef,
        offset: ["start 90%", "start 30%"],
    });

    // Animaciones del header
    const xLeft = useTransform(headerProgress, [0, 1], [-100, 0]);
    const xRight = useTransform(headerProgress, [0, 1], [100, 0]);
    const headerOpacity = useTransform(headerProgress, [0.5, 0.8], [0, 1]);
    const badgeY = useTransform(headerProgress, [0, 0.5], [20, 0]);
    const paraY = useTransform(headerProgress, [0.3, 1], [16, 0]);
    const paraOpacity = useTransform(headerProgress, [0.3, 1], [0, 1]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth scroll para el timeline
    const alturaLineaTiempo = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", "100%"]
    );

    const N = subprocesos.length;

    // Activación de los pasos en base al scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (N === 0) return;
        const step = Math.min(Math.floor(latest * N), N - 1);
        setActiveStep(step);
    });

    const current = subprocesos[activeStep] || null;
    const progressPct = N > 0 ? Math.round(((activeStep + 1) / N) * 100) : 0;

    return (
        <section className="py-10">
            {/* Header de la sección */}
            <div ref={headerRef} className="text-center mb-20 px-6 overflow-hidden">
                <motion.span
                    className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase bg-primary/5 px-4 py-2 rounded-full border border-primary/50"
                    style={{ opacity: headerOpacity, y: badgeY }}
                >
                    <MapPin className="w-4 h-4" />
                    El camino completo
                </motion.span>

                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mt-8 flex flex-wrap items-baseline justify-center gap-x-4">
                    <motion.span style={{ x: xLeft, opacity: headerOpacity }}>
                        Cómo
                    </motion.span>
                    <motion.span className="text-primary" style={{ x: xRight, opacity: headerOpacity }}>
                        funciona
                    </motion.span>
                </h2>

                <motion.p
                    className="text-muted-foreground mt-4 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    style={{ opacity: paraOpacity, y: paraY }}
                >
                    {subprocesos.length} etapas claras que guían al estudiante desde el inicio hasta su graduación.
                </motion.p>
            </div>

            {/* Para pantallas grandes scrollytelling */}
            <div ref={containerRef} className="hidden lg:block relative" style={{ height: `${subprocesos.length * 100}vh` }}
                onMouseEnter={() => setHovered("Scroll")} onMouseLeave={clearHovered}>
                <div className="sticky top-0 h-screen flex">
                    {/* Panel izquierdo de progreso */}
                    <div className="w-[26%] xl:w-[22%] flex flex-col justify-center relative px-8 xl:px-12 border-r border-border/50">
                        {/* Numero indicador del paso */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.span key={`ghost-${activeStep}`}
                                    className="text-[16rem] xl:text-[20rem] font-black leading-none text-foreground/4"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.4 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {current?.numero}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        {/* Contenido de la linea del tiempo */}
                        <div className="relative z-10 space-y-8">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-tight text-muted-foreground">
                                    Proceso de Titulación
                                </p>
                                <AnimatePresence mode="wait">
                                    <motion.p key={`label-${activeStep}`}
                                        className={`mt-1 text-lg font-black ${current?.color}`}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {current?.tituloCorto}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            {/* Timeline vertical -> progreso */}
                            <div className="relative">
                                {/* Fondo de la timeline */}
                                <div className="absolute left-[6px] top-3 bottom-3 w-[2px] bg-border rounded-full" />
                                {/* Relleno de la timeline */}
                                <motion.div
                                    className="absolute left-[6px] top-3 w-[2px] bg-primary rounded-full origin-top"
                                    style={{ height: alturaLineaTiempo }}
                                />

                                <div className="space-y-7 pl-7">
                                    {subprocesos.map((step, i) => {
                                        const isDone = i < activeStep;
                                        const isActive = i === activeStep;
                                        return (
                                            <div key={step.numero} className="relative flex items-center gap-3" >
                                                {/* Punto de paso actual */}
                                                <div
                                                    className={`
                                                            absolute -left-[28px] w-[14px] h-[14px] rounded-full border-2
                                                            flex items-center justify-center
                                                            transition-all duration-500
                                                            ${isDone
                                                            ? "bg-primary border-primary"
                                                            : isActive
                                                                ? "bg-primary border-primary shadow-[0_0_0_5px] shadow-primary/20 scale-125"
                                                                : "bg-background border-border"
                                                        }
                                                        `}
                                                >
                                                    {isDone && (
                                                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                                                    )}
                                                </div>

                                                {/* Titulo del paso activo */}
                                                <span
                                                    className={`
                                                            text-sm font-medium transition-all duration-400
                                                            ${isActive
                                                            ? `${current?.color} font-bold`
                                                            : isDone
                                                                ? "text-muted-foreground"
                                                                : "text-muted-foreground/40"
                                                        }
                                                        `}
                                                >
                                                    {step.tituloCorto}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Barra de progreso inferior */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                                    <span>Progreso general</span>
                                    <span className={`font-bold ${current?.color}`}>
                                        {progressPct}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel derecho con el contenido del subproceso */}
                    <div className="flex-1 relative overflow-hidden flex flex-col justify-center px-12 xl:px-20 pt-20">
                        {/* Fondo animado con gradiente */}
                        <AnimatePresence>
                            <motion.div
                                key={`grad-${activeStep}`}
                                className={`absolute inset-0 bg-linear-to-br ${current?.degradado}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                            />
                        </AnimatePresence>

                        {/* Numero decorativo en la parte inferior derecha */}
                        <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={`deco-${activeStep}`}
                                    className="block text-[28vw] font-black leading-none text-foreground/25"
                                    initial={{ opacity: 0, x: 60, scale: 0.85 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -60, scale: 1.1 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {current?.numero}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        {/* Contenido del paso actual */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`step-${activeStep}`}
                                className="relative z-10 max-w-2xl"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Badges row */}
                                <div className="flex items-center flex-wrap gap-3 mb-8">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]
                                                px-3.5 py-1.5 rounded-full border ${current?.iconBg} border-current/20 ${current?.color}`}
                                    >
                                        Etapa {current?.numero}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5" />
                                        {current?.duracion}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div
                                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8
            ${current?.fondoIcono} border border-current/10 shadow-sm`}
                                >
                                    {(() => {
                                        const IconComponent = (LucideIcons as any)[current?.icono];
                                        return IconComponent ? <IconComponent className="w-8 h-8 text-primary" /> : null;
                                    })()}
                                </div>

                                {/* Title */}
                                <h3 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-5">
                                    {current?.titulo}
                                </h3>

                                {/* Description */}
                                <p className="text-muted-foreground text-base xl:text-lg leading-relaxed mb-8 max-w-lg">
                                    {current?.descripcion}
                                </p>

                                {/* Participants */}
                                <div className="space-y-2.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        Participantes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {current?.participantes.map((p: any) => (
                                            <span
                                                key={p}
                                                className="inline-flex items-center gap-1.5 text-xs
                                                        bg-background/60 backdrop-blur-sm text-muted-foreground
                                                        px-3 py-1.5 rounded-full font-medium border border-border/60"
                                            >
                                                <UserRound className="w-3 h-3" />
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Para pantallas pequeñas lista de tarjetas animadas */}
            <div className="lg:hidden px-4 space-y-5">
                {subprocesos.map((step, i) => (
                    <motion.div
                        key={step.numero}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            delay: i * 0.06,
                        }}
                        className={`relative p-6 rounded-2xl border border-border/60
                            bg-linear-to-br ${step.degradado} bg-card/80
                            backdrop-blur-sm overflow-hidden`}
                    >
                        {/* Giant ghost number */}
                        <span className="absolute -right-3 -bottom-5 text-[7rem] font-black text-foreground/5 leading-none select-none pointer-events-none">
                            {step.numero}
                        </span>

                        <div className="relative z-10">
                            {/* Header row */}
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${step.fondoIcono}`}
                                >
                                    {(() => {
                                        const IconComponent = (LucideIcons as any)[step.icono];
                                        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                                    })()}
                                </div>
                                <div>
                                    <span
                                        className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step.color}`}
                                    >
                                        Etapa {step.numero}
                                    </span>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3" />
                                        {step.duracion}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">
                                {step.titulo}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                {step.descripcion}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {step.participantes.map((p: any) => (
                                    <span
                                        key={p}
                                        className="text-[10px] bg-background/60 text-muted-foreground
                                            px-2.5 py-1 rounded-full font-medium border border-border/50"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}