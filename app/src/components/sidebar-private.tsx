"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { LogOut, UserRound } from "lucide-react"
import { data } from "@/constants/menu-privado";

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
import { useUsuarios } from "@/hooks/use-usuario";
import { environment } from "@/lib/api/client";

export function SidebarPrivate({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { logout, loading: authLoading } = useAuth();
    const { obtenerUsuarioAutenticado, loading: usuarioLoading } = useUsuarios();
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();

    const cargarUsuario = async () => {
        try {
            const res = await obtenerUsuarioAutenticado();
            const fotoUrl = res.data.foto ? `${environment.baseUrl}/${res.data.foto}` : "";
            setUser({
                ...res.data,
                foto: fotoUrl
            });
        } catch (error: any) {
            console.error("Error al obtener usuario autenticado:", error.message);
        }
    };

    useEffect(() => {
        cargarUsuario();
    }, []);

    // Filtra el menú según el rol
    const menuFiltrado = data.group
        .map(group => ({
            // items de cada grupo
            ...group,
            items: group.items.filter(item => item.roles.includes(user?.idRol?.codigo))
        }))
        // grupos que no esten vacios
        .filter(group => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarGroupLabel><span className="font-bold text-primary">PERIODO: </span>&nbsp; MARZO - JUNIO 2026</SidebarGroupLabel>
            </SidebarHeader>
            <SidebarContent>
                {menuFiltrado.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.url === pathname} className="hover:bg-primary/20 hover:text-primary">
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {/* Perfil */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="hover:bg-primary/20 hover:text-primary py-5">
                            <a href="/#">
                                <Avatar className="h-6 w-6">
                                    {user?.foto ? (
                                        <img src={user.foto} alt={user?.usuario} className="rounded-full object-cover w-full h-full" />
                                    ) : (
                                        <AvatarFallback>
                                            <UserRound />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-primary">{user?.usuario}</span>
                                    <span className="text-xs text-muted-foreground">{user?.idRol?.nombre}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Logout */}
                    <SidebarMenuItem>
                        <SidebarMenuButton className="hover:bg-primary/20 hover:text-primary hover:cursor-pointer" onClick={() => logout()}>
                            <LogOut />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
