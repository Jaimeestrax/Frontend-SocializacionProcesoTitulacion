'use client';

import { StepForward, StepBack } from 'lucide-react';
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

export default function Paso2() {
    const router = useRouter();
    const totalPasos = 3; // Total de pasos
    const pasoActual = 1; // Paso actual

    return (
        <div>
            <Field className="px-12 w-full">
                <FieldLabel htmlFor="progress-upload">
                    <span>Paso 1 de 3</span>
                    <span className="ml-auto">33%</span>
                </FieldLabel>
                <Progress className='h-3' value={33} id="progress-upload" />
            </Field>

            <div className="flex w-full max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl p-6 md:p-2 mt-2 md:mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/** Cuadro izquierda*/}
                    <div className="bg-foreground/10 relative rounded-lg md:rounded-xl p-6 flex items-center justify-center">
                        {/** Imagen principal centrada */}
                        <img
                            src="https://avatar.vercel.sh/shadcn1"
                            alt="Event cover"
                            className="w-full h-full object-cover rounded-lg brightness-60 grayscale dark:brightness-40"
                        />

                        {/* Texto superpuesto arriba del logo*/}
                        <div className="absolute bottom-18 right-12 bg-accent/75 rounded-md shadow-md p-2 z-20 max-w-50">
                            <p className="text-xs font-medium italic">
                                ¡Observa como avanza el proceso! Visualizar el progreso es la clave para llegar a la meta.
                            </p>
                        </div>

                        {/* Logo superpuesto esquina inferior derecha */}
                        <div className="absolute bottom-2 right-4 z-20 w-20 h-20 rounded-full bg-sky-400 flex items-center justify-center shadow-lg">
                            <img src="/images/logo.png" alt="logo" className="w-12 h-18" />
                        </div>
                    </div>

                    {/**  Cuadro derecho */}
                    <div className="text-left">
                        <a href="/subprocesos" className="text-xs text-primary lg:text-sm hover:text-foreground/50">
                            SUBPROCESOS
                        </a>
                        <p className="text-lg font-bold md:text-2xl lg:text-4xl mb-2 mt-2 lg:mb-8 lg:mt-12">
                            Visualiza el progreso
                        </p>
                        <p className="text-xs text-muted-foreground lg:text-lg mb-6 lg:mb-12">
                            Monitorea el flujo de cada subproceso en tiempo real con indicadores claros de avance.
                        </p>

                        <div className="grid grid-cols-2 gap-2 lg:gap-6">
                            <Button variant="default" className="p-2 md:p-4" onClick={() => router.push("/onboarding/paso3")}>
                                Siguiente <StepForward />
                            </Button>
                            <Button variant="link" className="border-2 border-primary p-2 md:p-4" onClick={() => router.push("/home")}>
                                Saltar a la página principal
                            </Button>
                        </div>

                        {/** Dots de navegación */}
                        <div className="flex items-center justify-center lg:justify-start gap-2 md:mt-8 lg:mt-24">
                            {Array.from({ length: totalPasos }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`rounded-full transition-all duration-300 ${i + 1 === pasoActual
                                        ? "md:w-6 md:h-2 lg:w-8 xl:w-10 bg-primary"       // activo: alargado
                                        : "md:w-2 md:h-2 lg:w-4 xl:w-6 bg-muted-foreground/30"  // inactivo: redondo
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
