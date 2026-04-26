import {
    LayoutDashboard,
    GitBranch,
    FileText,
    Users,
    Newspaper,
    Settings
} from "lucide-react"

export const data = {
    items: [
        {
            title: "Inicio",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Subprocesos",
            url: "/gestion-subprocesos",
            icon: GitBranch,
        },
        {
            title: "Instrumentos",
            url: "/gestion-instrumentos",
            icon: FileText,
        },
        {
            title: "Usuarios",
            url: "#",
            icon: Users,
        },
        {
            title: "Noticias",
            url: "#",
            icon: Newspaper,
        },
        {
            title: "Soporte",
            url: "#",
            icon: Settings,
        },
    ]
}