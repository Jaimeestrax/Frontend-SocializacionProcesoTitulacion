import { Glasses, Calendar, Newspaper } from "lucide-react";
import { motion } from "motion/react";

import { environment } from "@/lib/api/client";


export function NewsCard({ noticia, className = "" }: { noticia: any, className?: string }) {

    const estiloPrioridad = (prioridad: string) => {
        switch (prioridad) {
            case "Alta":
                return "bg-red-500/10 text-red-500 border-red-500/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]";
            case "Media":
                return "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]";
            case "Baja":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`group relative flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer h-full ${estiloPrioridad(noticia.prioridad)} ${className}`}
        >
            {/* Sección de imagen */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                {noticia.imagen ? (
                    <img src={`${environment.baseUrl}/${noticia.imagen}`} alt={noticia.titulo}
                        className="object-cover transition-transform duration-700 group-hover:scale-105 w-full h-full" />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Newspaper className="w-16 h-16 text-muted-foreground" />
                    </div>
                )}
                {/* Estilo de gradiente */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Badge sobre la imagen */}
                <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md bg-background/80 border ${estiloPrioridad(noticia.prioridad)}`}>
                        {noticia.prioridad}
                    </span>
                </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="flex flex-col flex-1 p-6 z-10 bg-card">
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(noticia.fechaRegistro).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                    </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {noticia.titulo}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-1">
                    {noticia.descripcion}
                </p>

                {/* Footer de la tarjeta */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">
                        Por <span className="font-semibold text-foreground">{noticia.idEncargadoGenerar.nombres} {noticia.idEncargadoGenerar.apellidos}</span>
                    </span>
                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Glasses className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
