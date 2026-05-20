"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const rows = [
    { text: "SOLICITUD REVISIÓN APROBACIÓN", direction: 1 },
    { text: "DEFENSA TITULACIÓN GRADUACIÓN", direction: -1 }
];

function MarqueeRow({ text, direction, scrollYProgress }: {
    text: string;
    direction: number;
    scrollYProgress: any;
}) {
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        direction === 1 ? ["0%", "-25%"] : ["-25%", "0%"]
    );

    const words = Array(4).fill(text.split(" ")).flat();

    return (
        <div className="mt-12 -rotate-4">
            <motion.div style={{ x }} className="inline-flex items-center gap-6">
                {words.map((word, i) =>
                    i % 2 === 0
                        ? <span key={i} className="text-2xl md:text-4xl lg:text-7xl font-black tracking-tighter text-foreground">{word}</span>
                        : <span key={i} className="text-2xl md:text-4xl lg:text-7xl font-black tracking-tighter text-primary">{word}</span>
                )}
            </motion.div>
        </div>
    );
}

export function ScrollMarquee() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    return (
        <div ref={ref} className="py-12 space-y-2 overflow-hidden">
            {rows.map((row) => (
                <MarqueeRow
                    key={row.text}
                    text={row.text}
                    direction={row.direction}
                    scrollYProgress={scrollYProgress}
                />
            ))}
        </div>
    );
}