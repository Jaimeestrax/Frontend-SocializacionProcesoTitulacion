"use client";

import { X, Send, Plus, Bot, Download } from "lucide-react";
import { Button } from "./ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/hooks/use-chatbot";

import { environment } from "@/lib/api/client";

interface ChatbotWindowProps {
    onClose: () => void;
}

interface Opcion {
    parametro: string;
    opcion: string;
    archivo?: string;
}

export function ChatbotWindow({ onClose }: ChatbotWindowProps) {
    const { procesarMensajeUsuario, loading } = useChatbot();
    // Para enfocar siempre al ultimo mensaje
    const mensajesEndRef = useRef<HTMLDivElement>(null);

    const [contexto, setContexto] = useState("inicio");
    const [mensajeInput, setMensajeInput] = useState("");
    const [mensajes, setMensajes] = useState([
        {
            tipo: "bot",
            contenido: "Bienvenido. ¿Cómo puedo ayudarte?"
        }
    ]);

    const [opciones, setOpciones] = useState<Opcion[]>([
        {
            parametro: "faqs",
            opcion: "Preguntas frecuentes"
        },
        {
            parametro: "subprocesos",
            opcion: "Información del proceso"
        }
    ]);

    const agregarMensaje = (tipo: string, contenido: string) => {
        setMensajes(prev => [
            ...prev,
            {
                tipo,
                contenido
            }
        ]);
    };

    // Llamada al backend para determinar opciones
    const handleMensaje = async (numeroOpcion: number) => {
        // Obtiene la info completa de la opcion desde el array de opciones
        const opcionSeleccionada = opciones[numeroOpcion - 1];

        // Si es una opción invalida
        if (!opcionSeleccionada) {
            if (Number.isNaN(numeroOpcion) || typeof numeroOpcion !== 'number') {
                agregarMensaje("usuario", "Texto inválido");
            } else {
                agregarMensaje("usuario", numeroOpcion.toString());
            }
            agregarMensaje("bot", "No pude entender tu solicitud. Porfavor selecciona una opción válida.");
            setMensajeInput("");
            return;
        }

        // Si la opcion seleccionada tiene un archivo se descarga
        if (opcionSeleccionada.archivo) {
            handleDescarga(opcionSeleccionada.archivo);
            agregarMensaje("usuario", `Descargando: ${opcionSeleccionada.opcion}...`);
            return;
        }

        // Si es una opción valida
        agregarMensaje("usuario", opcionSeleccionada.opcion);
        try {
            const res = await procesarMensajeUsuario(contexto, opcionSeleccionada.parametro);

            agregarMensaje("bot", res.message);
            setContexto(res.data.contexto); // Actualiza el contexto -> otro nivel en el arbol de decisión

            // Inicializa nuevo array de opciones
            let nuevasOpciones: Opcion[] = [];

            // Añadimos los instrumentos a las opciones si esque vienen
            if (res.data.instrumentos) {
                nuevasOpciones.push(
                    ...res.data.instrumentos.map(
                        (instrumento: any) => ({
                            parametro: instrumento.idInstrumento._id,
                            opcion: instrumento.idInstrumento.nombre,
                            archivo: instrumento.idInstrumento.archivo
                        })
                    )
                );
            }

            if (res.data.contexto === "inicio") {
                // Si las notificaciones estan vacias muestra mensaje
                if (nuevasOpciones.length === 0) agregarMensaje("bot", "¿Algo mas en lo que pueda ayudarte?");

                nuevasOpciones.push(
                    {
                        parametro: "faqs",
                        opcion: "Preguntas frecuentes"
                    },
                    {
                        parametro: "subprocesos",
                        opcion: "Información del proceso"
                    }
                );
            }

            if (res.data.contexto === "faqs") {
                nuevasOpciones = res.data.faqsEncontradas.map(
                    (faq: any) => ({
                        parametro: faq._id,
                        opcion: faq.pregunta
                    })
                );
            }

            if (res.data.contexto === "subprocesos") {
                nuevasOpciones = res.data.subprocesos.map(
                    (subproceso: any) => ({
                        parametro: subproceso._id,
                        opcion: subproceso.nombre
                    })
                );
            }

            if (res.data.contexto === "actividades") {
                nuevasOpciones = res.data.actividades.map(
                    (actividad: any) => ({
                        parametro: actividad._id,
                        opcion: actividad.nombre
                    })
                );
            }

            if (res.data.contexto.startsWith("actividad_")) {
                nuevasOpciones = [
                    {
                        parametro: "fechas",
                        opcion: "Fechas de la actividad"
                    },
                    {
                        parametro: "participante",
                        opcion: "Encargado de la actividad"
                    },
                    {
                        parametro: "instrumentos",
                        opcion: "Documentos relacionados"
                    }
                ];
            }

            // Actualiza las opciones a mostrar en el Chatbot
            setOpciones(nuevasOpciones);
            setMensajeInput("");
        } catch (error: any) {
            console.error("Error al obtener respuesta del chatbot:", error.message);
            agregarMensaje("bot", "Algo salio mal. Intentalo de nuevo.");
        }
    };

    // Auto-scroll cuando cambien los mensajes u opciones
    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes, opciones]);

    // Descargar achivo de un instrumento
    const handleDescarga = (archivo: any) => {
        const url = `${environment.baseUrl}/${archivo}`;
        window.open(url, '_blank'); // Abre en otra pestaña
    };

    // Evita que el scroll se prolongue hacia la pantalla principal
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Fondo desenfocado */}
            <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

            {/* Ventana chatbot */}
            <div className="relative w-[380px] h-[600px] bg-accent rounded-2xl shadow-2xl shadow-primary mr-18 mt-auto mb-22 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-primary text-muted px-5 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bot />
                        <div className="flex flex-col">
                            <h2 className="font-black leading-tight">SOPTI-BOT</h2>
                            <span className="-mt-1 text-xs lg:text-sm">Siempre listo para ayudar</span>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onClose} className="cursor-pointer">
                        <X />
                    </Button>
                </div>

                {/* Mensajes */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {
                        mensajes.map((mensaje, index) => (
                            <div key={index} className={`rounded-xl px-3 py-1.5 text-[10px] sm:text-xs text-start whitespace-pre-wrap font-semibold
                                ${mensaje.tipo === "bot" ? "max-w-[70%] bg-primary/25" : "max-w-[50%] bg-primary text-accent text-center ml-auto"}`}>
                                {mensaje.contenido}
                            </div>
                        ))
                    }

                    {/* Opcioens de respuesta */}
                    {opciones.length > 0 &&
                        <div className="flex flex-col gap-2">
                            {
                                opciones.map(
                                    (opcion, index) => (
                                        <Button key={opcion.parametro} variant="outline" disabled={loading} className="rounded-xl justify-start cursor-pointer py-2 h-auto"
                                            onClick={() => {
                                                if (opcion.archivo) {
                                                    handleDescarga(opcion.archivo);
                                                } else {
                                                    handleMensaje(index + 1);
                                                }
                                            }}>
                                            {opcion.archivo ? (
                                                <div className="flex items-center gap-1">
                                                    <Download />
                                                    <span className="px-1 text-[10px] sm:text-xs text-start whitespace-pre-wrap">
                                                        {index + 1}. {opcion.opcion}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="px-1 text-[10px] sm:text-xs text-start whitespace-pre-wrap">{index + 1}. {opcion.opcion}</span>
                                            )}
                                        </Button>
                                    )
                                )
                            }
                        </div>
                    }

                    {/* Marcador de fin (para el scroll) */}
                    <div ref={mensajesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-3 flex items-center gap-2">
                    <Button variant="outline">
                        <Plus />
                    </Button>
                    <InputGroup className="flex-1 bg-secondary rounded-full border-2">
                        <InputGroupInput id="opcion" type="text" placeholder="Indique su opción..."
                            value={mensajeInput} onChange={e => setMensajeInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleMensaje(Number(mensajeInput)); }}
                            className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                    </InputGroup>
                    <Button onClick={() => handleMensaje(Number(mensajeInput))} className=" bg-primary text-accent rounded-full p-2 cursor-pointer">
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
}