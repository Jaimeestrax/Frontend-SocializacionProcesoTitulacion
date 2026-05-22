import {
    House,
    GitFork,
    FileText,
    Users,
    Newspaper,
    BadgeQuestionMark,
    ShieldUser,
    BookUser,
    GraduationCap,
    Route
} from "lucide-react"

export const data = {
    group: [
        {
            title: "Parametrización",
            items: [
                {
                    title: "Inicio",
                    url: "/dashboard",
                    icon: House,
                    roles: [1, 2]
                },
                {
                    title: "Instrumentos",
                    url: "/gestion-instrumentos",
                    icon: FileText,
                    roles: [1, 2]
                },
                {
                    title: "Subprocesos",
                    url: "/gestion-subprocesos",
                    icon: GitFork,
                    roles: [1, 2]
                },
                {
                    title: "Planificación",
                    url: "/gestion-planificaciones",
                    icon: Route,
                    roles: [1, 2]
                },
                {
                    title: "Noticias",
                    url: "/gestion-noticias",
                    icon: Newspaper,
                    roles: [1, 2]
                },
                {
                    title: "Soporte al usuario",
                    url: "/gestion-soporte",
                    icon: BadgeQuestionMark,
                    roles: [1, 2]
                },
            ]
        },
        {
            title: "Administración",
            items: [
                {
                    title: "Cargos",
                    url: "/gestion-cargos",
                    icon: BookUser,
                    roles: [1]
                },
                {
                    title: "Carreras",
                    url: "/gestion-carreras",
                    icon: GraduationCap,
                    roles: [1]
                },
                {
                    title: "Roles",
                    url: "/gestion-roles",
                    icon: ShieldUser,
                    roles: [1]
                },
                {
                    title: "Usuarios",
                    url: "/gestion-usuarios",
                    icon: Users,
                    roles: [1]
                }
            ]
        }
    ]
}