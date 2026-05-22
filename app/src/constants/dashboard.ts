import { GitFork, FileText, Users, Route, Newspaper, ShieldUser, BookUser } from 'lucide-react';

export const cards = [
    {
        icon: FileText,
        title: "Gestión de instrumentos",
        description: "Administre los instrumentos relacionados a cada actividad.",
        buttonLabel: "Gestionar",
        buttonClass: "border-purple-600 bg-purple-600/10 text-purple-600",
        route: "/gestion-instrumentos",
        roles: [1, 2]
    },
    {
        icon: GitFork,
        title: "Gestión subprocesos",
        description: "Configure los subprocesos dentro del proceso de titulación.",
        buttonLabel: "Gestionar",
        buttonClass: "border-primary bg-primary/20 text-primary",
        route: "/gestion-subprocesos",
        roles: [1, 2]
    },
    {
        icon: Route,
        title: "Planificación proceso",
        description: "Gestione la planificación del proceso para el periodo académico actual.",
        buttonLabel: "Planificar",
        buttonClass: "border-sky-600 bg-sky-600/10 text-sky-600",
        route: "/gestion-planificaciones",
        roles: [1, 2]
    },
    {
        icon: Newspaper,
        title: "Noticias y avisos",
        description: "Gestione las noticias y/o avisos durante el periodo académico actual.",
        buttonLabel: "Gestionar",
        buttonClass: "border-success-foreground bg-success/20 text-success-foreground",
        route: "/gestion-noticias",
        roles: [1, 2]
    },
    {
        icon: Users,
        title: "Control de usuarios",
        description: "Gestione accesos y perfiles del personal administrativo.",
        buttonLabel: "Administrar",
        buttonClass: "border-amber-600 bg-amber-600/10 text-amber-600",
        route: "/gestion-usuarios",
        roles: [1]
    },
    {
        icon: ShieldUser,
        title: "Gestión de roles",
        description: "Administre los roles y permisos de los usuarios del sistema.",
        buttonLabel: "Administrar",
        buttonClass: "border-emerald-600 bg-emerald-600/10 text-emerald-600",
        route: "/gestion-roles",
        roles: [1]
    },
    {
        icon: BookUser,
        title: "Gestión de cargos",
        description: "Gestione los tipos de participantes del proceso de titulación.",
        buttonLabel: "Gestionar",
        buttonClass: "border-pink-600 bg-pink-600/10 text-pink-600",
        route: "/gestion-cargos",
        roles: [1]
    },
];