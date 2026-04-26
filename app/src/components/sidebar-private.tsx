"use client"

import * as React from "react"
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button"

import { LogOut } from "lucide-react"
import { data } from "@/interfaces/menu-privado";

import { useAuthContext } from "@/hooks/use-auth-context";

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
    const { user } = useAuthContext();

    if (!user) return null;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>

            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {data.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.url === usePathname()}>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>
                                        {item.title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

            </SidebarContent>
            <SidebarFooter>
                {/* Perfil */}
                <p>Usuario: {user.usuario}</p>
                {/* Logout */}
                <Button variant="link" onClick={() => { logout(); }}>
                    Cerrar sesión <LogOut />
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
