'use client';

import { Button } from "@/components/ui/button";

import { ArrowBigRightDash } from 'lucide-react';

import { useRouter } from "next/navigation";

export default function Bienvenida() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center p-4 h-full">
      <div className="w-full max-w-md md:max-w-xl lg:max-w-4xl bg-card px-6 py-24 rounded-2xl shadow-md border border-gray-300 dark:border-gray-900">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/** Imagen izquierda */}
          <div className="bg-foreground/10 flex items-center justify-center p-4 rounded-lg md:rounded-xl">
            <div className="w-48 h-48 rounded-full bg-red-500 flex items-center justify-center">
              <img src="/images/logo.png" alt="logo" className="w-25 h-45" />
            </div>
          </div>
          {/**  Cuadro derecho */}
          <div className="text-center md:text-left">
            <p className="text-xs text-primary lg:text-sm m-4 md:mb-2">
              ESTAS MUY CERCA DE LOGRAR TU META
            </p>
            <p className="text-lg font-bold md:text-2xl lg:text-4xl mb-2 md:mb-4">
              Bienvenido a conocer el proceso de <span className="text-primary">titulación</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              La manera mas simple y efectiva de conocer el proceso de titulación paso a paso
            </p>

            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
              <Button variant="default" className="p-2 md:p-4" onClick={() => router.push("/onboarding/paso1")}>
                Comenzar <ArrowBigRightDash />
              </Button>
              <Button variant="link" className="border-2 border-primary p-2 md:p-4" onClick={() => router.push("/home")}>
                Saltar a la página principal
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
