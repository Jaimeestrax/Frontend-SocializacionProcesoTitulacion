'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { StepForward, StepBack, CircleCheck, CloudUpload, FileText, FileDown } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function Paso3() {
    const router = useRouter();
    const totalPasos = 3; // Total de pasos
    const pasoActual = 2; // Paso actual

    return (
        <div className="flex flex-col px-6 lg:px-24 xl:px-50 2xl:px-60">
            <Field className="px-12 w-full">
                <FieldLabel htmlFor="progress-upload">
                    <span>Paso 2 de 3</span>
                    <span className="ml-auto">66%</span>
                </FieldLabel>
                <Progress className='h-3' value={66} id="progress-upload" />
            </Field>

            <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center gap-2 bg-secondary rounded-2xl p-6 mb-6 shadow-md">
                {/* Imagen costado */}
                <div className="w-30 h-30 rounded-full bg-foreground-muted border-primary/50 border-4 flex items-center justify-center">
                    <img src="/images/logo.png" alt="logo" className="w-15 h-25" />
                </div>
                {/* Cuadro de dialogo */}
                <p className="text-sm md:text-lg lg:text-xl italic bg-background px-6 py-2 rounded-full">
                    " Descarga los formatos necesarios para presentar en cada actividad, asegurando el cumplimiento de los lineamientos institucionales "
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-6">
                <Card className="border-b-success border-b-6">
                    <CardHeader>
                        <CardTitle>
                            <CircleCheck className="text-success-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-foreground">Solicitud de opción de titulación para el estudiante que elige examen de carácter complexivo</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center bg-success">
                        <Button variant="ghost" className="px-8 py-4">
                            <FileDown /> Descargar
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="border-b-warning border-b-6">
                    <CardHeader>
                        <CardTitle>
                            <CloudUpload className="text-warning" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-foreground">Formato de comunicación para la designación de Director(a) para el acompañamiento académico</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center bg-warning">
                        <Button variant="ghost" className="px-8 py-4">
                            <FileDown /> Descargar
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="hidden md:flex border-b-destructive border-b-6">
                    <CardHeader>
                        <CardTitle>
                            <FileText className="text-destructive" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-foreground">Formato para anteproyecto de la opción: Trabajo de Titulación modalidad Proyecto Técnico</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center bg-destructive">
                        <Button variant="ghost" className="px-8 py-4">
                            <FileDown /> Descargar
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col gap-8 md:gap-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="link" className="border-2 border-primary p-2 md:p-4 md:col-start-2 hover:cursor-pointer" onClick={() => router.push("/onboarding/paso2")}>
                        <StepBack /> Atras
                    </Button>
                    <Button variant="default" className="p-2 md:p-4 md:col-start-3 hover:cursor-pointer" onClick={() => router.push("/onboarding/paso4")}>
                        Siguiente <StepForward />
                    </Button>
                </div>
                {/** Dots de navegación */}
                <div className="flex items-center justify-center gap-2">
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
    );
}
