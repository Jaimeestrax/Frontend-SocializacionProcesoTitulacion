"use client";

import { motion } from "framer-motion";
import { Mail, CircleUser } from "lucide-react";
import { Button } from "./ui/button";
import { environment } from "@/lib/api/client";

export default function ContactCard({ usuario, index }: { usuario: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: index * 0.05 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden bg-muted rounded-2xl p-5 space-y-4 flex flex-col items-center justify-center"
        >
            {/* Degradado */}
            <div className="absolute inset-0 bg-linear-to-b from-primary/15 via-primary/5 to-transparent" />

            {/* Avatar e Información */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="h-25 w-25 rounded-full bg-accent border-2 border-primary flex items-center justify-center"
                >
                    {usuario.foto ? (
                        <img src={`${environment.baseUrl}/${usuario.foto}`} alt="Foto" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <CircleUser className="w-20 h-20" />
                    )}
                </motion.div>
                <p className="font-bold text-sm md:text-base leading-tight">{usuario.nombres}</p>
                <p className="font-bold text-sm md:text-base leading-tight -mt-3">{usuario.apellidos}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-semibold">{usuario.idCarrera.nombre}</p>
            </div>

            {/* Botón de correo */}
            <Button variant="outline" className="flex items-center justify-center gap-2 text-xs md:text-base px-5 py-1.5">
                <Mail className="h-5 w-5" />
                {usuario.correo}
            </Button>
        </motion.div>
    );
}