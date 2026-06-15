"use client";

import { useState, useEffect } from "react";
import { NewsHero } from "@/components/noticias/news-hero";
import { NewsCarousel } from "@/components/noticias/news-carousel";

import { useNoticias } from "@/hooks/use-noticia";

export default function NoticiasPage() {
    const { obtenerNoticiasPublico, loading } = useNoticias();
    const [noticias, setNoticias] = useState<any[]>([]);

    const cargarNoticias = async () => {
        try {
            const res = await obtenerNoticiasPublico();
            setNoticias(res.data);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener noticias:", error.message);
            //toast.error(error.message);
        }
    };

    useEffect(() => {
        cargarNoticias();
    }, []);

    return (
        <div className="mx-auto px-4 md:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <h1 className="text-xl lg:text-2xl font-black uppercase tracking-widest text-foreground">
                    Noticias y Avisos
                </h1>
                <p className="text-sm md:text-lg font-medium text-muted-foreground">
                    Manténgase informado sobre novedades, fechas importantes y comunicados oficiales del proceso de titulación.
                </p>
            </div>

            {/*Noticia Destacada */}
            <NewsHero noticia={noticias[0]} />

            {/* Carrusel de noticias */}
            <NewsCarousel noticias={noticias} />
        </div>
    );
}
