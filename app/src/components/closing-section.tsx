"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

const QUOTE = "Tu esfuerzo de hoy es el título que celebrarás mañana.";
const BRAND = "SOPTI-SOFT · Sistema de Socialización del Proceso de Titulación";

export function ClosingSection() {
    const words = QUOTE.split(" ");

    return (
        <section className="relative py-36 px-6 overflow-hidden">
            {/* Fondo degradado */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/25 to-primary/50 pointer-events-none" />

            {/* Círculo decorativo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-muted-foreground/75 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-muted-foreground/75 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Icono central */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full
                        bg-primary/10 border border-primary/20 mb-14 shadow-lg shadow-primary/10"
                >
                    <GraduationCap className="w-10 h-10 text-primary" />
                </motion.div>

                {/* Animación de la cita por palabras */}
                <div
                    className="flex flex-wrap justify-center gap-x-4 gap-y-1
                        text-4xl sm:text-5xl md:text-6xl xl:text-7xl
                        font-black tracking-tight leading-tight mb-6"
                    aria-label={QUOTE}
                >
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.55,
                                delay: i * 0.06,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className={
                                /* Highlight key words */
                                word === "título" || word === "celebrarás"
                                    ? "text-primary"
                                    : ""
                            }
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>

                {/* Animación linea horizontal */}
                <div className="relative max-w-2xl mx-auto my-12">
                    {/* Fondo*/}
                    <div className="h-px bg-border rounded-full" />
                    {/* Animación de carga */}
                    <motion.div
                        className="absolute inset-0 h-px bg-primary rounded-full origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    />
                    {/* Punto final */}
                    <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2
                            w-3 h-3 rounded-full bg-primary shadow-md shadow-primary/40"
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 2.4 }}
                    />
                    {/* Punto de inicio */}
                    <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2
                            w-2 h-2 rounded-full bg-primary/50"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    />
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary"
                >
                    {BRAND}
                </motion.p>
            </div>
        </section>
    );
}
