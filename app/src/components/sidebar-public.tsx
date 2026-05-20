"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation";

import { LogIn } from "lucide-react"
import { data } from "@/constants/menu-public";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar"

import { useEffect, useState } from "react";
import { usePlanificacion } from "@/hooks/use-planificacion";

export function SidebarPublic({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();

    const { obtenerPeriodoActual, loading } = usePlanificacion();
    const [periodoActual, setPeriodoActual] = useState<any>(null);
    const pathname = usePathname();

    const cargarPeriodoActual = async () => {
        try {
            const res = await obtenerPeriodoActual();
            setPeriodoActual(res.data);
        } catch (error: any) {
            console.error("Error al obtener periodo actual:", error.message);
        }
    };

    useEffect(() => {
        cargarPeriodoActual();
    }, []);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarGroupLabel className="flex flex-col items-start gap-1">
                    <span className="font-bold text-primary">PERIODO: </span>
                    <span>{periodoActual}</span>
                </SidebarGroupLabel>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {data.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.url === pathname} className="hover:bg-primary/20 hover:text-primary">
                                <a href={item.url}>
                                    {/* <item.icon /> */}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                {/* Login */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="hover:bg-primary/20 hover:text-primary hover:cursor-pointer" onClick={() => router.push("/auth/sign-in")}>
                            <LogIn />
                            <span>Iniciar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
