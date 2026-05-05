"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"

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

} from "@/components/ui/sidebar"


export function SidebarPublic({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const router = useRouter();

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
                {/* Login */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => router.push("/auth/sign-in")}>
                            <LogIn />
                            <span>Iniciar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
