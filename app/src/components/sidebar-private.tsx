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
import { useUsuario } from "@/hooks/use-usuario";


export function SidebarPrivate({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { logout, loading: authLoading } = useAuth();
    const { obtenerUsuarioAutenticado, loading: usuarioLoading } = useUsuario();
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>

            </SidebarHeader>
            <SidebarContent>
                {data.group.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.url === pathname}
                                        className="hover:bg-primary/20 hover:text-primary"
                                    >
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
                        <SidebarMenuButton asChild>
                            <a href="/#">
                                <Avatar className="h-5 w-5">
                                    {/* <AvatarImage src={user?.foto} alt={user?.usuario} /> */}
                                    <AvatarFallback>
                                        <UserRound className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <span>Usuario</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Logout */}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => logout()}>
                            <LogOut />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
