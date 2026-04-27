"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


import { LogOut, UserRound } from "lucide-react"
import { data } from "@/interfaces/menu-privado";


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"


export function SidebarPrivate({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { logout, loading } = useAuth();
    const pathname = usePathname();
    const [user, setUser] = useState<any>();
    // Carga inicial de la página
    useEffect(() => {
        const identity = localStorage.getItem("identity");
        if (identity) {
            setUser(JSON.parse(identity));
        }
    }, []);


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>

            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {data.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
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
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        {item.title}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {/* Perfil */}
                    <SidebarMenuItem>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <a href="/#">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src={user?.foto} alt={user?.usuario} />
                                                <AvatarFallback>
                                                    <UserRound className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{user?.usuario}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {user?.usuario}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarMenuItem>

                    {/* Logout */}
                    <SidebarMenuItem>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton onClick={() => logout()}>
                                        <LogOut />
                                        <span>Cerrar sesión</span>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Cerrar sesión
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
