"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { ChevronRight, GitFork, FileText, Users } from 'lucide-react';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("identity") || "{}");
        setUser(storedUser);
    }, []);

    return (
        <div className="px-2 py-1">
            <p className="font-bold text-xl">
                Bienvenido, <span className="text-primary">{user?.nombres} {user?.apellidos}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Centro de parametrización de la información acerca del proceso de titulación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 bg-accent p-4 rounded-md">
                <Card>
                    <CardHeader>
                        <CardTitle><GitFork /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Gestión Subprocesos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Configura y ordena los subprocesos del proceso de titulación.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-primary bg-primary/20 text-primary"
                            onClick={() => router.push("/gestion-subprocesos")}>
                            Gestionar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><FileText /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Gestión de instrumentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Administra los instrumentos relacionados a cada actividad</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-success-foreground bg-success/20 text-success-foreground"
                            onClick={() => router.push("/gestion-instrumentos")}>
                            Revisar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Users /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Control de Usuarios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Gestiona accesos y perfiles del personal administrativo</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-warning bg-warning/10 text-warning">
                            Administrar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

    );
}
