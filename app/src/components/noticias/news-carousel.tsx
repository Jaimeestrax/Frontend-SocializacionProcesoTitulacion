"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { NewsCard } from "./news-card";

import { motion } from "motion/react";

export function NewsCarousel({ noticias }: { noticias: any[] }) {
    if (!noticias || noticias.length === 0) return null;

    return (
        <section className="mb-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-end justify-between mb-2"
            >
                <div>
                    <h2 className="text-3xl font-black tracking-tight mb-2">Historial de noticias</h2>
                    <p className="text-muted-foreground text-sm">Revisa todo lo que ha sucedido con el proceso de titulación.</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <Carousel
                    opts={{
                        align: "start",
                        dragFree: true,
                    }}
                    className="w-full relative"
                >
                    {/* Controles del Carrusel */}
                    <div className="flex justify-end gap-2 mb-6 pr-2">
                        <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-10 w-10 bg-muted border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" />
                        <CarouselNext className="relative right-0 top-0 translate-y-0 h-10 w-10 bg-muted border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" />
                    </div>

                    <CarouselContent className="-ml-4 md:-ml-6">
                        {noticias.map((noticia, index) => (
                            <CarouselItem key={noticia._id} className="pl-4 md:pl-6 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <motion.div
                                    className="h-full"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <NewsCard noticia={noticia} />
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </motion.div>
        </section>
    );
}
