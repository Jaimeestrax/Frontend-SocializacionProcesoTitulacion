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
    const { obtenerPeriodoActual, obtenerPorcentajeAvance, obtenerProximasActividades, obtenerSubprocesoActual, loading } = usePlanificacion();
    const router = useRouter();

    const [periodoActual, setPeriodoActual] = useState<any>(null);
    // Subproceso vigente en la fecha actual
    const [subprocesoActual, setSubprocesoActual] = useState<any>(null);
    // Proximas actividades del subproceso actual
    const [proximasActividades, setProximasActividades] = useState<any>([]);
    // Porcentaje de avance de las actividades sobre el total de las mismas
    const [porcentajeAvance, setPorcentajeAvance] = useState<number>(0);
    // Calcular tiempo restante para proximo subproceso
    const [tiempoRestante, setTiempoRestante] = useState<string>("");

    const cargarDatos = async () => {
        // Cargar periodo actual
        try {
            const respuestaPeriodoActual = await obtenerPeriodoActual();
            setPeriodoActual(respuestaPeriodoActual.data);
            //toast.success(respuestaActual.message);
        } catch (error: any) {
            console.error("Error al cargar periodo actual:", error.message);
            //toast.error(error.message);
        }

        // Cargar subproceso actual
        try {
            const respuestaSubprocesoActual = await obtenerSubprocesoActual();
            setSubprocesoActual(respuestaSubprocesoActual.data);
            //toast.success(respuestaSubprocesoActual.message);
        } catch (error: any) {
            console.error("Error al cargar subproceso actual:", error.message);
            //toast.error(error.message);
        }

        // Cargar proximas actividades
        try {
            const respuestaProximasActividades = await obtenerProximasActividades();
            setProximasActividades(respuestaProximasActividades.data);
            //toast.success(respuestaProximasActividades.message);
        } catch (error: any) {
            console.error("Error al cargar proximas actividades:", error.message);
            //toast.error(error.message);
        }

        //Cargar porcentaje de avance
        try {
            const respuestaPorcentajeAvance = await obtenerPorcentajeAvance();
            setPorcentajeAvance(respuestaPorcentajeAvance.data);
            //toast.success(respuestaPorcentajeAvance.message);
        } catch (error: any) {
            console.error("Error al cargar porcentaje de avance:", error.message);
            //toast.error(error.message);
        }
    }

    useEffect(() => {
        try {
            cargarDatos();
            toast.success("Información cargada exitosamente");
        } catch (error: any) {
            console.error("Error al cargar información de inicio:", error.message);
            toast.error(error.message);
        }
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
            <Card className="bg-foreground-muted text-primary p-4">
                <div className="flex justify-between gap-2">
                    <div>
                        <CardHeader>
                            <CardTitle className="mt-2 mb-4">ESTADO ACTUAL</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {subprocesoActual ? (
                                <>
                                    <p className="text-lg md:text-2xl font-semibold mb-2">{`${subprocesoActual?.identificador}. ${subprocesoActual?.nombre}`}</p>
                                    <CardDescription className="text-secondary/75">{subprocesoActual?.descripcion}</CardDescription>
                                </>
                            ) : (
                                <CardDescription className="text-secondary/75">No existe un subproceso actual</CardDescription>
                            )}
                        </CardContent>
                        <div className="p-4 mt-6">
                            <Button variant="secondary" className="p-4" onClick={() => router.push("/subprocesos")}>
                                Ver detalle
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-start p-2">
                        <BadgeCheck className="text-secondary" size={72} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
