"use client";

import { steps } from "@/constants/pasos-storytelling";

export default function ProcessStory() {

    return (
        <section className="p-4">

            {/** Título general del scrollytelling */}
            <div className="flex flex-row lg:flex-col items-center justify-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter">
                <span className="text-primary">COMO</span>
                <span>&nbsp;FUNCIONA</span>
            </div>

            {steps.map((step) => (
                <div key={step.number} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/** Parte izquierda */}
                    <div className="hidden lg:flex items-center justify-center">
                        {step.images.map((image) => {
                            return (
                                <img key={image} src={image} alt=""
                                    className={`lg:rounded-2xl border-muted border-4 lg:shadow-2xl bg-primary w-50 h-50`}
                                />
                            );
                        })}
                    </div>

                    {/** Parte derecha */}
                    <div className="flex flex-col gap-2 p-2">
                        {/** TEXTO */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-end lg:justify-center font-bold text-xl md:text-2xl">
                                <span className="text-primary bg-muted px-4 py-2 rounded-full border-4 border-primary">{step.number}</span>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter wrap-break-word">
                                {step.title}
                            </h2>

                            <p className="text-base md:text-lg text-muted-foreground italic">
                                {step.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}