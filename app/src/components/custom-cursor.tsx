"use client";

import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
import { useCursor } from '@/components/cursor-provider'

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const { isHovered, label } = useCursor();

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <motion.div
            animate={{
                x: position.x - (isHovered ? 32 : 10),
                y: position.y - (isHovered ? 32 : 10),
                width: isHovered ? 64 : 20,
                height: isHovered ? 64 : 20
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28
            }}
            className="hidden md:flex items-center justify-center bg-destructive fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        >
            {isHovered && (
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-bold text-secondary-foreground text-center leading-tight px-1"
                >
                    {label}
                </motion.span>
            )}
        </motion.div>

    );
}