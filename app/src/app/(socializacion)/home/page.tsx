"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { toast } from "@/components/ui/toast-custom";
import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { BadgeCheck, Clock9 } from 'lucide-react';
import { usePlanificacion } from "@/hooks/use-planificacion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const {
        obtenerPeriodoActual,
        obtenerPorcentajeAvance,
        obtenerProximasActividades,
        obtenerSubprocesoActual,
        obtenerActividadPorId,
        loading
    } = usePlanificacion();
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
    // Actividad seleccionada para ver detalle
    const [actividadSeleccionada, setActividadSeleccionada] = useState<any>(null);
    // Modal para ver el detalle
    const [isOpenDetalleActividad, setIsOpenDetalleActividad] = useState(false);

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

    useEffect(() => {
        // Función para calcular tiempo restante
        const calcularTiempo = () => {
            if (!proximasActividades || proximasActividades.length === 0) {
                setTiempoRestante("");
                return;
            }

            const fechaTexto = proximasActividades[0].fechaInicio.split("T")[0];
            const [anio, mes, dia] = fechaTexto.split("-").map(Number);
            const fechaInicio = new Date(anio, mes - 1, dia);

            const ahora = new Date();
            const diff = fechaInicio.getTime() - ahora.getTime();

            if (diff <= 0) {
                setTiempoRestante("00:00:00");
                return;
            }

            const horas = Math.floor(diff / (1000 * 60 * 60));
            const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);

            setTiempoRestante(
                `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`
            );
        };

        calcularTiempo();
        const intervalo = setInterval(calcularTiempo, 1000); // Actualiza cada segundo
        return () => clearInterval(intervalo);
    }, [proximasActividades]);

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

    const handleDetalleActividad = async (idActividad: string) => {
        try {
            const respuesta = await obtenerActividadPorId(idActividad);
            setActividadSeleccionada(respuesta.data);
            setIsOpenDetalleActividad(true);
            toast.success(respuesta.message);
        } catch (error: any) {
            console.error("Error al obtener el detalle de la actividad:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="px-4">
            {/** Encabezado */}
            <div className="flex justify-between gap-4">
                <div>
                    <p className="text-lg md:text-xl font-bold text-primary">PROCESO DE TITULACIÓN</p>
                    <p className="text-xs md:text-sm font-semibold text-muted-foreground">
                        Periodo académico: <span className="font-normal">{periodoActual}</span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-xs text-muted-foreground font-semibold">Próxima actividad en</p>
                    <div className="text-lg md:text-xl font-bold text-primary tabular-nums">
                        {tiempoRestante ? (
                            <div className="flex items-center gap-2">
                                <Clock9 size={20} />
                                {tiempoRestante}
                            </div>
                        ) : (
                            <span className="text-sm lg:text-xl">Sin actividades próximas</span>
                        )}
                    </div>
                </div>
            </div>

            <Separator className="mt-4 bg-foreground" />

            {/** Sección progreso actual */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-primary text-secondary p-4 lg:col-span-2">
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

                <Card className="bg-secondary text-primary p-6 lg:col-span-1 flex flex-col items-center justify-center gap-4">
                    <p className="text-md md:text-lg font-semibold self-start">Progreso del proceso</p>

                    <div className="relative flex items-center justify-center">
                        <svg width="140" height="140" viewBox="0 0 140 140">
                            {/* Fondo del círculo */}
                            <circle
                                cx="70" cy="70" r="56"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                className="text-muted/30"
                            />
                            {/* Arco de progreso */}
                            <circle
                                cx="70" cy="70" r="56"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="12"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 56}`}
                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - porcentajeAvance / 100)}`}
                                className="text-primary transition-all duration-700 ease-in-out"
                                transform="rotate(-90 70 70)"
                            />
                        </svg>
                        {/* Texto central */}
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold">{porcentajeAvance}%</span>
                            <span className="text-xs text-muted-foreground">completado</span>
                        </div>
                    </div>

                    <CardDescription className="text-primary/70 text-center text-xs">
                        Avance general del proceso de titulación
                    </CardDescription>
                </Card>
            </div>

            {/** Carrusel de subprocesos */}
            <div className="bg-secondary p-4 mt-4 rounded-lg">
                <p className="text-sm lg:text-xl font-semibold mb-4">Próximas actividades</p>
                <Carousel className="w-full">
                    <CarouselContent className="-ml-2">
                        {(proximasActividades?.length > 0 ? proximasActividades : [{}, {}, {}, {}]).map((actividad: any, index: number) => (
                            <CarouselItem key={index} className="basis-1/2 pl-1 md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <Card className="border-l-10 border-l-primary overflow-hidden hover:scale-105 hover:border-l-accent transition-transform duration-100 cursor-pointer">
                                        <div className="flex justify-between items-start p-4">
                                            <CardContent className="p-0 flex-1">
                                                <span className="text-sm md:text-md font-semibold leading-snug">
                                                    {actividad.nombre ? `${index + 1}. ${actividad.nombre}` : 'Preview'}
                                                </span>
                                            </CardContent>

                                            {actividad.fechaInicio && (
                                                <div className="flex flex-col items-center bg-accent rounded-md p-3 -mt-8 border b-1">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">
                                                        {formatearFecha(actividad.fechaInicio).split(" ")[1]}
                                                    </span>
                                                    <span className="text-xl font-bold leading-none">
                                                        {formatearFecha(actividad.fechaInicio).split(" ")[0]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pl-6">
                                            <Button variant="default" className="p-4" onClick={() => handleDetalleActividad(actividad._id)}>
                                                Ver detalle
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-2 mt-2">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            </div>

            {/** Modal para ver el detalle de una actividad */}
            <Dialog open={isOpenDetalleActividad} onOpenChange={setIsOpenDetalleActividad}>
                <DialogContent className="overflow-x-auto sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Detalle {actividadSeleccionada?.nombre}</DialogTitle>
                        <DialogDescription className="text-xs lg:text-sm">
                            Revise el detalle de la próxima actividad seleccionada.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 no-scrollbar max-h-[60vh] overflow-y-auto">
                        <div className="border rounded-md p-3 space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mt-1">{actividadSeleccionada?.descripcion}</p>
                                </div>
                                {actividadSeleccionada?.idParticipante?.nombre && (
                                    <Badge variant="default" className="text-xs shrink-0 ml-2">
                                        {actividadSeleccionada?.idParticipante?.nombre}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-4 font-semibold text-muted-foreground">
                                <span className="text-xs">Inicio: {formatearFecha(actividadSeleccionada?.fechaInicio)}</span>
                                <span className="text-xs">Fin: {formatearFecha(actividadSeleccionada?.fechaFin)}</span>
                            </div>
                            {actividadSeleccionada?.instrumentos?.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold">INSTRUMENTOS</p>
                                    {actividadSeleccionada?.instrumentos?.map((inst: any, ii: number) => (
                                        <div key={ii} className="flex items-center gap-2 text-xs">
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {inst?.identificador}
                                            </Badge>
                                            <span>{inst?.idInstrumento?.nombre}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
