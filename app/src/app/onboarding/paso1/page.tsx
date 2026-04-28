'use client';

import { Button } from "@/components/ui/button";
import { StepForward, StepBack } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TEXTO_COMPLETO = "¡Bienvenido! Soy tu guía, te ayudaré a descubrir todo lo que el sistema pone a tu disposición para orientarte en el proceso de titulación.";

export default function Paso1() {
    const router = useRouter();
    const [textoMostrado, setTextoMostrado] = useState("");
    const [terminado, setTerminado] = useState(false);

    useEffect(() => {
        let i = 0;
        const intervalo = setInterval(() => {
            setTextoMostrado(TEXTO_COMPLETO.slice(0, i + 1));
            i++;
            if (i >= TEXTO_COMPLETO.length) {
                clearInterval(intervalo);
                setTerminado(true);
            }
        }, 50); // velocidad en ms por caracter
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="w-full max-w-sm lg:max-w-lg bg-card p-6 md:p-1 relative">

            {/* Burbuja de pensamiento */}
            <div className="relative bg-secondary rounded-2xl p-6 mb-6 shadow-md">
                {/* Círculos del pensamiento (cola) */}
                <div className="absolute -bottom-10 left-26 w-12 h-12 bg-secondary rounded-full shadow-md" />
                <div className="absolute -bottom-18 left-32 w-8 h-8 bg-secondary rounded-full shadow-md" />
                <div className="absolute -bottom-24 left-36 w-6 h-6 bg-secondary rounded-full shadow-md" />
                <div className="absolute -bottom-30 left-40 w-4 h-4 bg-secondary rounded-full shadow-md" />
                <div className="absolute -bottom-36 left-45 w-2 h-2 bg-secondary rounded-full shadow-md" />

                <p className="text-lg md:text-xl lg:text-2xl italic">
                    {textoMostrado}
                    {/** Curso parpadeante mientras escribe */}
                    {!terminado && <span className="animate-pulse">|</span>}
                    {terminado && <span className="text-primary font-bold"> ¿Listo?</span>}
                </p>
            </div>

            {/* Imagen debajo de la burbuja */}
            <div className="flex items-center justify-center">
                <div className="w-120 h-120 flex items-center justify-center">
                    <img src="/images/logo.png" alt="logo" className="w-50 h-80" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
                <Button variant="default" className="p-2 md:p-4" onClick={() => router.push("/onboarding/paso2")}>
                    Siguiente <StepForward />
                </Button>
                <Button variant="link" className="p-2 md:p-4" onClick={() => router.push("/home")}>
                    Saltar a la página principal
                </Button>
            </div>
        </div>
    );
}
