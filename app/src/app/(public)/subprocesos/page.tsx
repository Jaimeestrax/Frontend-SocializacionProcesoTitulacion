"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { toast } from "@/components/ui/toast-custom";

import { BadgeCheck } from 'lucide-react';

import { usePlanificacion } from "@/hooks/use-planificacion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubprocesoPage() {
    const { obtenerPlanificacionVigente, loading } = usePlanificacion();
    const router = useRouter();
    // Planificacion vigente en la fecha actual
    const [planificacionActual, setPlanificacionActual] = useState<any>(null);

    const cargarPlanificacion = async () => {
        // Cargar planificación
        try {
            const res = await obtenerPlanificacionVigente();
            setPlanificacionActual(res.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al cargar planificación:", error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        cargarPlanificacion();
    }, []);

    const formatearFecha = (fecha: any) => {
        if (!fecha) return "S/N";
        //return fecha.split("T")[0];
        return new Date(fecha).toLocaleDateString("es-EC", {
            timeZone: "UTC", // Evita desfase UTC
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="px-4 space-y-4">
            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Cronograma de actividades</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Revise la planificación del proceso de titulación para el periodo actual.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    {/* <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoInstrumento(!isOpenNuevoInstrumento)}>
                        <FilePlusCorner /> Nuevo instrumento
                    </Button> */}
                </div>
            </div>

            {/** Planificación del proceso actual */}
            {planificacionActual?.subprocesos?.map((subproceso: any) => (
                <Card key={subproceso._id} className="bg-foreground-muted text-primary p-4">
                    <div className="flex justify-between gap-2">
                        <div>
                            <CardHeader>
                                <CardTitle className="mt-2 mb-4">ESTADO ACTUAL</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {subproceso ? (
                                    <>
                                        <p className="text-lg md:text-2xl font-semibold mb-2">{`${subproceso?.identificador}. ${subproceso?.nombre}`}</p>
                                        <CardDescription className="text-secondary/75">{subproceso?.descripcion}</CardDescription>
                                    </>
                                ) : (
                                    <CardDescription className="text-secondary/75">No existe un subproceso actual</CardDescription>
                                )}
                            </CardContent>
                            <div className="p-4 mt-6">
                                <Button variant="secondary" className="p-4" onClick={() => router.push("/detalle-subproceso")}>
                                    Ver detalle
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-start p-2">
                            <BadgeCheck className="text-secondary" size={72} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
