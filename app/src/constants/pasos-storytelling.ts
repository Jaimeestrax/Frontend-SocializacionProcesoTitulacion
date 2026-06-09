import { ConfiguracionPasos } from "./estilos-subprocesos";

export function mapSubprocesosPasos(subprocesos: any[]) {
    return subprocesos.map((sub, index) => {
        // 1. Obtener la configuración visual según el identificador
        const visual = ConfiguracionPasos[sub.identificador] || ConfiguracionPasos.DEFAULT;

        // 2. Extraer participantes únicos de las actividades de manera dinámica
        const participantesUnicos = new Set<string>();
        if (sub.actividades) {
            sub.actividades.forEach((act: any) => {
                if (act.idParticipante?.nombre) {
                    participantesUnicos.add(act.idParticipante.nombre);
                }
            });
        }
        // Si no hay participantes en las actividades se queda vacio
        const participantes = participantesUnicos.size > 0 ? Array.from(participantesUnicos) : [""];

        // 3. Formatear las fechas de duración
        const fechaInicio = new Date(sub.fechaInicio).toLocaleDateString('es-EC', { month: 'short', day: 'numeric' });
        const fechaFin = new Date(sub.fechaFin).toLocaleDateString('es-EC', { month: 'short', day: 'numeric' });
        const duracion = `${fechaInicio} — ${fechaFin}`;

        return {
            numero: String(index + 1).padStart(2, "0"),
            tituloCorto: visual.tituloCorto,
            titulo: sub.nombre,
            descripcion: sub.descripcion,
            icono: visual.icono,
            color: visual.color,
            fondoIcono: visual.fondoIcono,
            degradado: visual.degradado,
            participantes,
            duracion
        };
    });
}