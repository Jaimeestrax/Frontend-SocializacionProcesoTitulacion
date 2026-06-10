import { Clock, Calendar, User, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { environment } from "@/lib/api/client";

export function NewsHero({ noticia }: { noticia: any }) {
    if (!noticia) return null;

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
        <section className="relative w-full h-[80vh] min-h-[600px] max-h-[800px] rounded-lg overflow-hidden group mb-6">
            {/* Fondo con imagen */}
            {noticia?.imagen && (
                <div className="absolute inset-0 bg-muted">
                    <img src={`${environment.baseUrl}/${noticia.imagen}`} alt={noticia.titulo}
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105 opacity-15" />
                </div>
            )}

            {/* Degradado */}
            <div className="absolute inset-0 bg-linear-to-l from-primary/15 via-transparent to-primary/5" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/15 via-transparent to-primary/5" />

            {/* Contenedor de contenido */}
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-20 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-primary text-primary-foreground">
                            <Sparkles className="w-3.5 h-3.5" />
                            Última noticia
                        </span>
                        <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md bg-background/50 ${estiloPrioridad(noticia.prioridad)}`}>
                            Prioridad: {noticia.prioridad}
                        </span>
                    </div>

                    {/* Titulo */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-foreground drop-shadow-lg">
                        {noticia.titulo}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg md:text-2xl text-muted-foreground/90 leading-relaxed mb-8 max-w-3xl drop-shadow-sm font-medium">
                        {noticia.descripcion}
                    </p>

                    {/* Metadatos y Acciones */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between border-t border-border/30 pt-6">
                        <div className="flex items-center gap-6 text-sm font-semibold text-foreground">
                            <span className="flex items-center gap-2 bg-background backdrop-blur-md px-3 py-1.5 rounded-lg">
                                <Calendar className="w-4 h-4 text-primary" />
                                {new Date(noticia.fechaRegistro).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2 bg-background backdrop-blur-md px-3 py-1.5 rounded-lg">
                                <Clock className="w-4 h-4 text-primary" />
                                2 min lectura
                            </span>
                        </div>

                        <span className="flex items-center text-sm font-semibold text-foreground gap-2 bg-background backdrop-blur-md px-3 py-1.5 rounded-lg">
                            <User className="w-4 h-4 text-primary" />
                            Publicado por: {noticia.idEncargadoGenerar.nombres} {noticia.idEncargadoGenerar.apellidos}
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
