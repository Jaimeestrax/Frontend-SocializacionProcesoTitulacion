import {
    LayoutDashboard,
    GitBranch,
    Newspaper
} from "lucide-react"

export const data = {
    items: [
        {
            title: "Inicio",
            url: "/home",
            icon: LayoutDashboard,
        },
        {
            title: "Subprocesos",
            url: "/subprocesos",
            icon: GitBranch,
        },
        {
            title: "Noticias",
            url: "#",
            icon: Newspaper,
        },
    ]
}