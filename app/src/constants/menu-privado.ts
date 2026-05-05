import {
    House,
    GitBranch,
    FileText,
    Users,
    Newspaper,
    Settings,
    ShieldUser,
    BookUser,
    Route
} from "lucide-react"

export const data = {
    group: [
        {
            title: "Gestión proceso",
            items: [
                {
                    title: "Inicio",
                    url: "/dashboard",
                    icon: House,
                },
                {
                    title: "Instrumentos",
                    url: "/gestion-instrumentos",
                    icon: FileText,
                },
                {
                    title: "Subprocesos",
                    url: "/gestion-subprocesos",
                    icon: GitBranch,
                },
                {
                    title: "Planificación",
                    url: "/planificacion",
                    icon: Route,
                },
                {
                    title: "Noticias",
                    url: "#",
                    icon: Newspaper,
                },
                {
                    title: "Soporte al usuario",
                    url: "#",
                    icon: Settings,
                },
            ]
        },
        {
            title: "Gestión sistema",
            items: [
                {
                    title: "Cargos",
                    url: "/gestion-cargos",
                    icon: BookUser,
                },
                {
                    title: "Roles",
                    url: "/gestion-roles",
                    icon: ShieldUser,
                },
                {
                    title: "Usuarios",
                    url: "/gestion-usuarios",
                    icon: Users,
                },
            ]
        }
    ]
}