"use client";

import { useEffect, useState } from "react";
import * as motion from "motion/react-client";

export default function Loading() {
    const [count, setCount] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                const next = prev + Math.floor(Math.random() * 5) + 1;

                if (next >= 100) {
                    clearInterval(interval);

                    setTimeout(() => {
                        setIsExiting(true);
                    }, 300);

                    return 100;
                }

                return next;
            });
        }, 40);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            animate={
                isExiting
                    ? {
                        scale: 1.15,
                        opacity: 0,
                        filter: "blur(20px)"
                    }
                    : {
                        scale: 1,
                        opacity: 1,
                        filter: "blur(0px)"
                    }
            }
            transition={{
                duration: 1,
                ease: "easeInOut"
            }}
            className="fixed inset-0 flex items-center justify-center overflow-hidden bg-primary"
        >
            {/** Mascota */}
            <motion.img
                src="/images/logo.png"
                alt="Mascota"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, -2, 2, 0]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-40 md:w-56 lg:w-72 object-contain"
            />

            {/** Número gigante */}
            <motion.h1
                initial={{
                    opacity: 0,
                    scale: 0.8
                }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                transition={{
                    duration: 0.6
                }}
                className="absolute text-[20vw] font-black text-primary-foreground bottom-10 right-10"
            >
                {count}
            </motion.h1>

            {/** Glow decorativo */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full bg-primary-foreground/10 blur-3xl"
            />
        </motion.div>
    );
}