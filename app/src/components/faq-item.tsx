"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const answerVariants = {
    closed: { opacity: 0, height: 0, marginTop: 0 },
    open: { opacity: 1, height: "auto", marginTop: 12 }
};

export default function FaqItem({ faq }: { faq: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-background rounded-2xl shadow-sm cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="p-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-primary text-base md:text-[17px] leading-snug">
                        {faq.pregunta}
                    </h3>

                    {/* Respuesta expandible */}
                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                key="answer"
                                variants={answerVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                className="text-muted-foreground text-sm leading-relaxed overflow-hidden"
                            >
                                {faq.respuesta}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Preview cuando está cerrado */}
                    <AnimatePresence initial={false}>
                        {!isOpen && (
                            <motion.p
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-muted-foreground text-sm mt-2 line-clamp-1"
                            >
                                {faq.respuesta}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* palabras clave */}
                    {/* {faq.keywords.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1">
                            {faq.keywords.map((keyword: string, index: number) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="inline-block bg-accent text-primary font-medium text-xs px-3 py-1.5 rounded-full"
                                >
                                    {keyword}
                                </motion.span>
                            ))}
                        </div>
                    )} */}
                </div>

                {/* Flecha animada */}
                <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="mt-1 shrink-0"
                >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
            </div>
        </motion.div>
    );
}