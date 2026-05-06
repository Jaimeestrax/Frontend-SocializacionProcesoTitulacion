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
                    icon: GitBranch,
                    roles: [1, 2]
                },
                {
                    title: "Planificación",
                    url: "/planificacion",
                    icon: Route,
                    roles: [1, 2]
                },
                {
                    title: "Noticias",
                    url: "#",
                    icon: Newspaper,
                    roles: [1, 2]
                },
                {
                    title: "Soporte al usuario",
                    url: "#",
                    icon: Settings,
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
                },
            ]
        }
    ]
}