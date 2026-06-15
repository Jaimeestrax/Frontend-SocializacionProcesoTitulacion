import { StoryStep } from "@/constants/story-step";

export const ConfiguracionPasos: Record<string, StoryStep> = {
    OM: {
        tituloCorto: "Opción y modalidad",
        icono: "Signpost",
        color: "text-blue-500",
        fondoIcono: "bg-blue-500/10",
        degradado: "from-blue-500/15 via-sky-500/5 to-transparent"
    },
    IP: {
        tituloCorto: "Perfil",
        icono: "FileCheck",
        color: "text-indigo-500",
        fondoIcono: "bg-indigo-500/10",
        degradado: "from-indigo-500/15 via-blue-500/5 to-transparent"
    },
    AN: {
        tituloCorto: "Anteproyecto",
        icono: "BookOpenCheck",
        color: "text-violet-500",
        fondoIcono: "bg-violet-500/10",
        degradado: "from-violet-500/15 via-purple-500/5 to-transparent"
    },
    AT: {
        tituloCorto: "Trabajo de grado",
        icono: "ScrollText",
        color: "text-amber-500",
        fondoIcono: "bg-amber-500/10",
        degradado: "from-amber-500/15 via-yellow-500/5 to-transparent"
    },
    ST: {
        tituloCorto: "Sustentación",
        icono: "CalendarDays",
        color: "text-orange-500",
        fondoIcono: "bg-orange-500/10",
        degradado: "from-orange-500/15 via-red-500/5 to-transparent"
    },
    // Paso de respaldo
    DEFAULT: {
        tituloCorto: "Proceso",
        icono: "Rocket",
        color: "text-gray-500",
        fondoIcono: "bg-gray-500/10",
        degradado: "from-gray-500/15 to-transparent"
    }
};