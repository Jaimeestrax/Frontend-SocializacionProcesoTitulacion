import { FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

import { environment } from "@/lib/api/client";

export function InlineInstruments({ instrumentos, estadoSubproceso }: { instrumentos: any[], estadoSubproceso: string }) {
    if (instrumentos.length === 0) return null;

    // Descargar achivo de un instrumento
    const handleDescarga = (instrumento: any) => {
        const url = `${environment.baseUrl}/${instrumento.archivo}`;
        window.open(url, '_blank'); // Abre en otra pestaña
    };

    return (
        <div className="mt-6 space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                Documentos Requeridos:
            </h4>
            <div className="grid gap-3">
                {instrumentos.map(inst => {
                    const isDisponible = estadoSubproceso === "finalizado" || estadoSubproceso === "en_proceso";

                    return (
                        <div
                            key={inst._id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/50 bg-background/50"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-muted shrink-0">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded text-accent-foreground">
                                        {inst.idInstrumento.nombre}
                                    </span>
                                </div>
                            </div>

                            <Button variant="outline" size="sm" className={`sm:w-auto w-full text-xs ${isDisponible ? 'hover:cursor-pointer' : 'cursor-not-allowed'}`}
                                disabled={!isDisponible}
                                onClick={() => handleDescarga(inst.idInstrumento)}
                            >
                                <FileDown className="w-4 h-4 mr-2" />
                                Descargar
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
