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

import { BadgeCheck, MessageSquareQuote, Clock9 } from 'lucide-react';

import { useSubprocesos } from "@/hooks/use-subproceso";
import { useEffect, useState } from "react";

export default function Home() {

    // const { obtenerSubprocesosProximos, obtenerSubprocesoActual, obtenerPorcentajeAvance } = useSubprocesos();
    const [subprocesoActual, setSubprocesoActual] = useState<any>(null);
    const [subprocesosProximos, setSubprocesosProximos] = useState<any>([]);
    // Calcular tiempo restante para proximo subproceso
    const [tiempoRestante, setTiempoRestante] = useState<string>("");
    // Porcentaje de avance
    const [porcentajeAvance, setPorcentajeAvance] = useState<number>(0);

    // const cargarDatos = async () => {
    //     // Cargar subproceso actual
    //     try {
    //         const respuestaActual = await obtenerSubprocesoActual();
    //         setSubprocesoActual(respuestaActual.data);
    //         //toast.success(respuestaActual.message);
    //     } catch (error: any) {
    //         console.error("Error al cargar subproceso actual:", error.message);
    //         //toast.error(error.message);
    //     }

    //     // Cargar subprocesos próximos (independiente del anterior)
    //     try {
    //         const respuestaProximos = await obtenerSubprocesosProximos();
    //         setSubprocesosProximos(respuestaProximos.data);
    //         //toast.success(respuestaProximos.message);
    //     } catch (error: any) {
    //         console.error("Error al cargar subprocesos próximos:", error.message);
    //         //toast.error(error.message);
    //     }

    //     // Cargar porcentaje de avance
    //     try {
    //         const respuestaPorcentajeAvance = await obtenerPorcentajeAvance();
    //         setPorcentajeAvance(respuestaPorcentajeAvance.data);
    //         //toast.success(respuestaPorcentajeAvance.message);
    //     } catch (error: any) {
    //         console.error("Error al cargar porcentaje de avance:", error.message);
    //         //toast.error(error.message);
    //     }
    // }

    // useEffect(() => {
    //     cargarDatos();
    // }, []);

    useEffect(() => {
        // Función para calcular tiempo restante
        const calcularTiempo = () => {
            if (!subprocesosProximos || subprocesosProximos.length === 0) {
                setTiempoRestante("");
                return;
            }

            const fechaInicio = new Date(subprocesosProximos[0].fecha_inicio);
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
    }, [subprocesosProximos]);

    return (
        <div className="p-4">
            {/** Encabezado */}
            <div className="flex justify-between gap-4">
                <div>
                    <p className="text-lg md:text-xl font-bold text-primary">PROCESO DE TITULACIÓN</p>
                    <p className="text-xs md:text-sm font-semibold text-muted-foreground">
                        Periodo académico: <span className="font-normal">Marzo - Junio 2026</span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="text-xs text-muted-foreground font-semibold">Próximo subproceso en</p>
                    <div className="text-lg md:text-xl font-bold text-primary tabular-nums">
                        {tiempoRestante ? (
                            <div className="flex items-center gap-2">
                                <Clock9 size={20} />
                                {tiempoRestante}
                            </div>
                        ) : (
                            <span>Sin próximos subprocesos</span>
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
                                <CardTitle className="mt-2 mb-4">SUBPROCESO ACTUAL</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg md:text-2xl font-semibold mb-2">{subprocesoActual?.nombre}</p>
                                <CardDescription className="text-secondary/75">{subprocesoActual?.descripcion}</CardDescription>
                            </CardContent>
                            <div className="p-4 mt-6">
                                <Button variant="secondary" className="p-4">Ver detalle</Button>
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
                <p className="text-md md:text-xl font-semibold mb-4">Próximos subprocesos</p>
                <Carousel className="w-full">
                    <CarouselContent className="-ml-2">
                        {(subprocesosProximos?.length > 0 ? subprocesosProximos : [{}, {}, {}, {}]).map((subproceso: any, index: number) => (
                            <CarouselItem key={index} className="basis-1/2 pl-1 md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <Card className="border-l-10 border-l-primary overflow-hidden hover:scale-105 hover:border-l-accent transition-transform duration-100 cursor-pointer">
                                        <div className="flex justify-between items-start p-4">
                                            <CardContent className="p-0 flex-1">
                                                <span className="text-sm md:text-md font-semibold leading-snug">
                                                    {subproceso.nombre ? `${index + 1}. ${subproceso.nombre}` : 'Preview'}
                                                </span>
                                            </CardContent>

                                            {subproceso.fecha_inicio && (
                                                <div className="flex flex-col items-center bg-accent rounded-md p-3 -mt-8 border b-1">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">
                                                        {new Date(subproceso.fecha_inicio).toLocaleString('es', { month: 'short' })}
                                                    </span>
                                                    <span className="text-xl font-bold leading-none">
                                                        {new Date(subproceso.fecha_inicio).getDate()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pl-6">
                                            <Button variant="default" className="p-4">Ver detalle</Button>
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

            {/** Botón flotante chatbot */}
            <button
                className="fixed bottom-12 right-6 z-50 bg-primary text-secondary rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
                onClick={() => console.log("abrir/cerrar chatbot")}
            >
                <MessageSquareQuote size={28} />
            </button>
        </div>
    );
}
