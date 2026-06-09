import { motion } from "motion/react";
import { Clock, CalendarClock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

import { environment } from "@/lib/api/client";

export function ContextualPanel({ data }: { data: any }) {
    // Extraemos y aplanamos todos los instrumentos relacionados al subproceso
    const todosLosInstrumentos = data?.actividades?.flatMap(
        (actividad: any) => actividad.instrumentos || []
    ) || [];

    // Descargar achivo de un instrumento
    const handleDescarga = (instrumento: any) => {
        const url = `${environment.baseUrl}/${instrumento.archivo}`;
        window.open(url, '_blank'); // Abre en otra pestaña
    };

    return (
        <div className="sticky top-24 space-y-6">
            {data && (
                <>
                    {/* Panel de Tiempo Restante */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm relative overflow-hidden shadow-warning"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-warning/75 rounded-full blur-xl pointer-events-none" />

                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Tiempo Restante
                        </h3>

                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-5xl font-black text-amber-500 tabular-nums leading-none">
                                {data.diasRestantes}
                            </span>
                            <span className="text-sm font-semibold text-muted-foreground mb-1">
                                días
                            </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {data.diasRestantes <= 0 ? "La etapa ha finalizado" : `Quedan ${data.diasRestantes} días para la finalización programada de esta etapa según la planificación vigente.`}
                        </p>

                        <div className="mt-4 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Cierre estimado:</span>
                                <span className="flex items-center gap-1.5 text-foreground">
                                    <CalendarClock className="w-3.5 h-3.5" />
                                    {new Date(data.fechaFin).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Repositorio de documentos */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm shadow-primary"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                            Repositorio de documentos
                        </h3>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {todosLosInstrumentos.length > 0 ? (
                                todosLosInstrumentos.map((instrumento: any, index: number) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="w-full justify-start hover:scale-[1.02] truncate transition-all text-xs cursor-pointer hover:text-primary"
                                        onClick={() => handleDescarga(instrumento.idInstrumento)}
                                    >
                                        <FileText className="w-4 h-4 mr-2 shrink-0 text-accent-foreground" />
                                        <span className="truncate">{instrumento.idInstrumento.nombre}</span>
                                    </Button>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground italic text-center py-2">
                                    No hay instrumentos disponibles
                                </p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}
