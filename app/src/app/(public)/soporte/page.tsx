"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useFaqs } from "@/hooks/use-faq";
import { useUsuarios } from "@/hooks/use-usuario";
import FaqItem from "@/components/faq-item";

import { Busqueda } from "@/constants/busqueda";
import ContactCard from "@/components/contact-card";

import { toast } from "@/components/ui/toast-custom";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { TextSearch } from 'lucide-react';


export default function SoportePage() {
    const { obtenerFaqs, loading: loadingFaqs } = useFaqs();
    const { listarUsuariosActivos, loading: loadingUsuarios } = useUsuarios();

    const [faqs, setFaqs] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);

    const [usuarios, setUsuarios] = useState<any[]>([]);

    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 5,
        palabra: ""
    });

    const [textoBusqueda, setTextoBusqueda] = useState("");

    // Carrusel de usuarios
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const cargarDatos = async () => {
        try {
            const res = await obtenerFaqs(busqueda);
            setFaqs(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener faqs:", error.message);
            toast.error(error.message);
        }

        try {
            const res = await listarUsuariosActivos();
            setUsuarios(res.data);
        } catch (error: any) {
            console.error("Error al obtener usuarios:", error.message);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [busqueda]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setBusqueda(prev => ({
                ...prev,
                pagina: 1,
                palabra: textoBusqueda
            }));
        }, 400);
        return () => clearTimeout(timeout);
    }, [textoBusqueda]);

    // Autoplay del carrusel
    useEffect(() => {
        if (isHovered || usuarios.length === 0) return;
        const timer = setInterval(() => {
            setCarouselIndex(prev => (prev + 1) % usuarios.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [isHovered, usuarios.length]);

    return (
        <div>
            {/* Encabezado */}
            <header className="max-w-4xl mx-auto pt-16 pb-8 px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold tracking-tight text-accent-foreground mb-4"
                >
                    ¿Cómo podemos ayudarte hoy?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base"
                >
                    Interactúa con nuestro chatbot o consulta las dudas más frecuentes sobre el proceso de titulación.
                </motion.p>

                {/* Input de búsqueda */}
                <div className="flex items-center justify-center">
                    <InputGroup className="p-2 bg-background w-full lg:w-2/3 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar pregunta..." value={textoBusqueda}
                            onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm md:placeholder:text-base"
                        />
                    </InputGroup>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Columna FAQs con altura fija y scroll interno */}
                <section className="lg:col-span-2 bg-accent p-4 rounded-2xl">
                    <h2 className="text-xl font-bold text-accent-foreground tracking-tight mb-4">Preguntas Frecuentes</h2>

                    <div className="max-h-[560px] overflow-y-auto pr-1 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {faqs.length > 0 ? (
                                faqs.map((faq) => (
                                    <FaqItem key={faq.id} faq={faq} />
                                ))
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-400 text-sm italic py-4"
                                >
                                    No se encontraron preguntas frecuentes registradas.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" className={!anterior ? "pointer-events-none opacity-50" : ""}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!anterior) return;
                                            setBusqueda(p => ({ ...p, pagina: p.pagina - 1 }));
                                        }}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink isActive href="#">{busqueda.pagina}</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#"
                                        className={!siguiente ? "pointer-events-none opacity-50" : ""}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!siguiente) return;
                                            setBusqueda(p => ({ ...p, pagina: p.pagina + 1 }));
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </section>

                {/* Columna carrusel de la comisión */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold text-primary tracking-tight">Comisión de Titulación</h2>
                    {/* Viewport del carrusel */}
                    <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{ height: "280px" }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <AnimatePresence mode="wait">
                            {usuarios.length > 0 && (
                                <motion.div
                                    key={carouselIndex}
                                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -40, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                                    className="absolute inset-0"
                                >
                                    <ContactCard usuario={usuarios[carouselIndex]} index={0} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Barra de progreso */}
                    {usuarios.length > 1 && (
                        <ProgressBar
                            duration={3000}
                            paused={isHovered}
                            key={carouselIndex}
                        />
                    )}

                    {/* Puntos indicadores */}
                    {usuarios.length > 1 && (
                        <div className="flex justify-center gap-2">
                            {usuarios.map((_, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => setCarouselIndex(i)}
                                    animate={{
                                        scale: i === carouselIndex ? 1.4 : 1,
                                        opacity: i === carouselIndex ? 1 : 0.35
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="w-2 h-2 rounded-full bg-primary"
                                    aria-label={`Ver miembro ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Componente auxiliar: barra de progreso animada
function ProgressBar({ duration, paused }: { duration: number; paused: boolean; key: number }) {
    return (
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: paused ? undefined : "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
            />
        </div>
    );
}