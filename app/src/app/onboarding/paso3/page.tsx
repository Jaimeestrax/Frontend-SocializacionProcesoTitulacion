'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { StepForward, StepBack } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Paso3() {
    const router = useRouter();
    const totalPasos = 3; // Total de pasos
    const pasoActual = 2; // Paso actual

    return (
        <div className="flex flex-col">
            <Field className="px-12 w-full">
                <FieldLabel htmlFor="progress-upload">
                    <span>Paso 2 de 3</span>
                    <span className="ml-auto">66%</span>
                </FieldLabel>
                <Progress className='h-3' value={66} id="progress-upload" />
            </Field>
            <div className="flex items-center gap-4 bg-secondary rounded-2xl p-6 mb-6 shadow-md">
                {/* Imagen costado */}
                <div className="w-25 h-25 rounded-full bg-foreground-muted border-primary/50 border-4 flex items-center justify-center">
                    <img src="/images/logo.png" alt="logo" className="w-15 h-20" />
                </div>
                {/* Cuadro de dialogo */}
                <p className="text-lg md:text-xl lg:text-2xl italic">
                    Descarga los instrumentos necesarios para cada subproceso, asegurando que cumpla con los formatos institucionales.
                </p>
            </div>
            <div className="w-full max-w-sm lg:max-w-lg bg-card p-6 md:p-1 relative">

                <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
                    <Button variant="link" className="p-2 md:p-4" onClick={() => router.push("/onboarding/paso2")}>
                        <StepBack /> Atras
                    </Button>
                    <Button variant="default" className="p-2 md:p-4" onClick={() => router.push("/onboarding/paso4")}>
                        Siguiente <StepForward />
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
    );
}
