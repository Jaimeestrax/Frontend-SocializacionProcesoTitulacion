'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { CircleCheckBig, Bot } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Paso4() {
    const router = useRouter();
    const totalPasos = 3; // Total de pasos
    const pasoActual = 3; // Paso actual

    return (
        <div>
            <Field className="px-12 w-full">
                <FieldLabel htmlFor="progress-upload">
                    <span>Paso 3 de 3</span>
                    <span className="ml-auto">100%</span>
                </FieldLabel>
                <Progress className='h-3' value={100} id="progress-upload" />
            </Field>

            <div className="flex w-full max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl p-6 md:p-2 mt-2 md:mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/** Cuadro izquierda*/}
                    <div className="bg-foreground/10 relative rounded-lg md:rounded-xl p-4 flex items-center justify-center">
                        {/* Texto superpuesto esquina superior derecha*/}
                        <div className="absolute top-[-20px] right-0 bg-accent rounded-full shadow-md p-4 z-20 max-w-75 flex items-center justify-center gap-2">
                            <Bot className="text-success-foreground" /> <span className="text-xs font-medium italic">Asistencia siempre disponible</span>
                        </div>

                        {/** Imagen principal centrada */}
                        <img src="/images/chatbot.png" alt="chatbot" className="w-full h-full object-cover rounded-lg opacity-75" />
                    </div>

                    {/**  Cuadro derecho */}
                    <div className="text-left">
                        <a href="#" className="text-xs text-primary lg:text-sm hover:text-foreground/50">
                            ACOMPAÑAMIENTO ACADÉMICO
                        </a>
                        <p className="text-lg font-bold md:text-2xl lg:text-4xl mb-2 mt-2 lg:mb-8 lg:mt-12">
                            Nunca estarás solo
                        </p>
                        <p className="text-xs text-muted-foreground md:text-sm lg:text-lg mb-4">
                            Conoce a nuestro <span className="text-primary font-bold">Chatbot</span>. Diseñado para asegurar que cada paso de tu formación sea un éxito.
                        </p>

                        <div className="flex items-center gap-2 bg-secondary rounded-md p-3 mb-6">
                            {/* Imagen costado */}
                            <img src="/images/logo.png" alt="logo" className="w-15 h-15" />
                            {/* Cuadro de dialogo */}
                            <p className="text-xs md:text-sm">
                                <span className="font-bold">Chat Inteligente 24/7</span>
                                <br />El chatbot responde tus dudas sobre el proceso de titulación al instante, en cualquier momento.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-12">
                            <Button variant="default" className="p-2 md:p-4 hover:cursor-pointer" onClick={() => router.push("/")}>
                                <CircleCheckBig /> Finalizar
                            </Button>

                            {/** Dots de navegación */}
                            <div className="flex items-center gap-2 lg:gap-4">
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
        </div>
    );
}
