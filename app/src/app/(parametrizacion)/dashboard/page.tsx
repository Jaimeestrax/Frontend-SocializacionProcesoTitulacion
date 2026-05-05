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
import { ChevronRight, GitFork, FileText, Users, CircleUser, Route, Newspaper } from 'lucide-react';
import Image from 'next/image';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsuario } from "@/hooks/use-usuario";

export default function Dashboard() {
    const router = useRouter();
    const { obtenerUsuarioAutenticado, loading } = useUsuario();
    const [user, setUser] = useState<any>(null);

    const cargarUsuario = async () => {
        try {
            const res = await obtenerUsuarioAutenticado();
            setUser(res.data);
        } catch (error: any) {
            console.error("Error al obtener usuario autenticado:", error.message);
        }
    };

    useEffect(() => {
        cargarUsuario();
    }, []);

    return (
        <div className="px-2 py-1">
            <p className="font-bold text-xl">
                Bienvenido, <span className="text-primary">{user?.nombres} {user?.apellidos}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Panel de parametrización del proceso de titulación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 bg-accent p-4 rounded-md">
                <Card className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                    <CardHeader className="flex items-center justify-center">
                        {user?.foto ? (
                            <Image src={user?.foto} alt="Foto" width={100} height={100} className="rounded-full" />
                        ) : (
                            <CircleUser size={100} />
                        )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-bold bg-muted p-2 rounded-md text-primary">Nombre completo: <span className="text-muted-foreground">{user?.nombreCompleto}</span></p>
                        <p className="font-bold bg-muted p-2 rounded-md text-primary">Correo: <span className="text-muted-foreground">{user?.correo}</span></p>
                        <p className="font-bold bg-muted p-2 rounded-md text-primary">Rol: <span className="text-muted-foreground">{user?.idCargo?.nombre}</span></p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-muted-foreground">Descripción: {user?.descripcion}</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><FileText /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Gestión de instrumentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Administre los instrumentos relacionados a cada actividad.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-success-foreground bg-success/20 text-success-foreground"
                            onClick={() => router.push("/gestion-instrumentos")}>
                            Gestionar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><GitFork /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Gestión Subprocesos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Configure y ordene los subprocesos del proceso de titulación.</p>
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
                        <CardTitle><Route /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Planificación proceso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Gestione la planificación del proceso para el periodo académico actual.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-sky-600 bg-sky-600/10 text-sky-600">
                            Planificar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Newspaper /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Noticias y avisos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Gestione las noticias y/o avisos durante el periodo académico actual.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-success-foreground bg-success/20 text-success-foreground"
                            onClick={() => router.push("/gestion-noticias")}>
                            Gestionar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Users /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Control de Usuarios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Gestione accesos y perfiles del personal administrativo.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-warning bg-warning/10 text-warning">
                            Administrar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Users /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Gestión de roles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Gestione los roles del sistema.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-emerald-600 bg-emerald-600/10 text-emerald-600">
                            Administrar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Users /></CardTitle>
                        <CardDescription className="font-bold text-foreground text-lg">Gestión de cargos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Gestione los cargos de los usuarios.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant={"ghost"} className="border-2 border-pink-600 bg-pink-600/10 text-pink-600">
                            Gestionar <ChevronRight />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

    );
}
