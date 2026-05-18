import {
    LayoutDashboard,
    CalendarClock,
    Newspaper,
    FileQuestionMark
} from "lucide-react"

export const data = {
    items: [
        {
            title: "Inicio",
            url: "/home",
            icon: LayoutDashboard,
        },
        {
            title: "Calendario",
            url: "/subprocesos",
            icon: CalendarClock,
        },
        {
            title: "Noticias",
            url: "/noticias",
            icon: Newspaper,
        },
        {
            title: "Soporte",
            url: "/soporte",
            icon: FileQuestionMark,
        },
    ]
}