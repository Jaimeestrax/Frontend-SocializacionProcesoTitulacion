"use client";

// Componentes de interfaz
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer"

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast-custom";

// Iconos
import { BadgePlus, MessageCircleQuestionMark, FileEdit, CircleX, TextSearch } from 'lucide-react';

// Utilidades
import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Faq } from "@/DTOs/faq";

// Uso de hooks que interactuan con la API
import { useFaqs } from "@/hooks/use-faq";
import { useDrawerDirection } from "@/hooks/use-drawer-size";

export default function GestionFaqs() {
    const { registrarFaq, obtenerFaqs, eliminarFaq, actualizarFaq, obtenerFaqPorId, contarFaqs, loading } = useFaqs();
    const drawerDirection = useDrawerDirection();

    // Listado de faqs
    const [faqs, setFaqs] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    const [totalFaqs, setTotalFaqs] = useState(0);

    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<{
        pregunta?: string,
        respuesta?: string
    }>({});

    const [erroresActualizar, setErroresActualizar] = useState<{
        pregunta?: string,
        respuesta?: string
    }>({});

    // Llamada asincrona reutilizable
    const cargarFaqs = async () => {
        try {
            const res = await obtenerFaqs(busqueda);
            const res2 = await contarFaqs();

            setFaqs(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalFaqs(res2.data);

            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener faqs:", error.message);
            toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => {
        cargarFaqs();
    }, [busqueda]);

    // Ejecuta busqueda
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

    // Registro de faqs
    const [isOpenNuevaFaq, setIsOpenNuevaFaq] = useState(false);

    const [faq, setFaq] = useState<Faq>({
        pregunta: "",
        respuesta: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { pregunta?: string, respuesta?: string } = {};
        if (!faq.pregunta.trim()) nuevosErrores.pregunta = "La pregunta es requerida";
        if (!faq.respuesta.trim()) nuevosErrores.respuesta = "La respuesta es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const res = await registrarFaq(faq);
            // Recarga la lista de faqs
            await cargarFaqs();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setFaq({
                pregunta: "",
                respuesta: ""
            });
            setIsOpenNuevaFaq(false);

        } catch (error: any) {
            console.error("Error al registrar pregunta frecuente:", error.message);
            toast.error(error.message);
        }
    };

    // Eliminacion de una faq
    const handleEliminarFaq = async (id: string) => {
        try {
            const res = await eliminarFaq(id);
            await cargarFaqs();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al eliminar la pregunta frecuente:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar faq
    const [isOpenEditarFaq, setIsOpenEditarFaq] = useState(false);
    const [faqEditar, setFaqEditar] = useState<Faq>({
        pregunta: "",
        respuesta: ""
    });
    const [faqEditarId, setFaqEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (faq: any) => {
        try {
            const res = await obtenerFaqPorId(faq._id);
            const faqData = res.data;
            setFaqEditar(faqData);
            setFaqEditarId(faq._id);
            setIsOpenEditarFaq(true);
        } catch (error: any) {
            console.error("Error al obtener pregunta frecuente para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { pregunta?: string, respuesta?: string } = {};
        if (!faqEditar.pregunta.trim()) nuevosErrores.pregunta = "La pregunta es requerida";
        if (!faqEditar.respuesta.trim()) nuevosErrores.respuesta = "La respuesta es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const res = await actualizarFaq(faqEditarId, faqEditar);
            setIsOpenEditarFaq(false);
            await cargarFaqs();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar pregunta frecuente:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="container mx-auto">
            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de preguntas frecuentes</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Gestione las preguntas y respuestas frecuentes que sirven como base de conocimiento para el chatbot.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevaFaq(!isOpenNuevaFaq)}>
                        <BadgePlus /> Nueva pregunta frecuente
                    </Button>
                </div>
            </div>

            {/** Listado de faqs */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <MessageCircleQuestionMark className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Preguntas frecuentes</CardTitle>
                                <CardDescription className="font-bold text-lg">{totalFaqs}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de preguntas frecuentes</p>
                {/** Buscador */}
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por pregunta..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Pregunta</TableHead>
                            <TableHead className="text-center">Respuesta</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {faqs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No hay preguntas frecuentes registradas
                                </TableCell>
                            </TableRow>
                        )}
                        {faqs.map((faq, i) => (
                            <TableRow key={faq._id}>
                                <TableCell className="text-center">{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell className="max-w-sm whitespace-normal wrap-break-words">{faq.pregunta}</TableCell>
                                <TableCell className="max-w-sm whitespace-normal wrap-break-words">{faq.respuesta}</TableCell>
                                <TableCell className="text-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleEditar(faq)}>
                                                    <FileEdit className="text-warning" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleEliminarFaq(faq._id)}>
                                                    <CircleX className="text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Eliminar</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/** Controles de paginación */}
                <br />
                <Pagination>
                    <PaginationContent>
                        {/** Anterior */}
                        <PaginationItem>
                            <PaginationPrevious href="#" className={!anterior ? "pointer-events-none opacity-50" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!anterior) return;
                                    setBusqueda(p => ({ ...p, pagina: p.pagina - 1 }));
                                }} />
                        </PaginationItem>
                        {/** Actual */}
                        <PaginationItem>
                            <PaginationLink isActive href="#">{busqueda.pagina}</PaginationLink>
                        </PaginationItem>
                        {/** Siguiente */}
                        <PaginationItem>
                            <PaginationNext href="#" className={!siguiente ? "pointer-events-none opacity-50" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!siguiente) return;
                                    setBusqueda(p => ({ ...p, pagina: p.pagina + 1 }));
                                }} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/** Drawer de registro de faqs */}
            <Drawer open={isOpenNuevaFaq} onOpenChange={setIsOpenNuevaFaq} direction={drawerDirection}
                onClose={() => {
                    setFaq({ pregunta: '', respuesta: '' });
                    setErroresRegistro({})
                }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Pregunta Frecuente</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar la pregunta frecuente.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-scroll" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="pregunta" className="text-xs">PREGUNTA FRECUENTE</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.pregunta ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="pregunta" type="text" placeholder="Ingrese el titulo para la pregunta frecuente"
                                        value={faq.pregunta} onChange={(e) => {
                                            setFaq({ ...faq, pregunta: e.target.value });
                                            if (erroresRegistro.pregunta) setErroresRegistro({ ...erroresRegistro, pregunta: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.pregunta ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.pregunta && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.pregunta}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="respuesta" className="text-xs">RESPUESTA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.respuesta ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <textarea id="respuesta" placeholder="Ingrese la respuesta de la pregunta frecuente" rows={3}
                                        value={faq.respuesta} onChange={(e) => {
                                            setFaq({ ...faq, respuesta: e.target.value });
                                            if (erroresRegistro.respuesta) setErroresRegistro({ ...erroresRegistro, respuesta: undefined });
                                        }}
                                        className={`w-full text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none bg-transparent ${erroresRegistro.respuesta ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.respuesta && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.respuesta}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevaFaq(false); setErroresRegistro({}) }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de preguntas frecuentes */}
            <Drawer open={isOpenEditarFaq} onOpenChange={setIsOpenEditarFaq} direction={drawerDirection}
                onClose={() => {
                    setFaq({ pregunta: '', respuesta: '' });
                    setErroresActualizar({})
                }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Pregunta Frecuente</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para editar la pregunta frecuente.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-scroll" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="pregunta" className="text-xs">PREGUNTA FRECUENTE</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.pregunta ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="pregunta" type="text" placeholder="Ingrese el titulo para la pregunta frecuente" required
                                        value={faqEditar.pregunta} onChange={(e) => {
                                            setFaqEditar({ ...faqEditar, pregunta: e.target.value });
                                            if (erroresActualizar.pregunta) setErroresActualizar({ ...erroresActualizar, pregunta: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.pregunta ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.pregunta && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.pregunta}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="respuesta" className="text-xs">RESPUESTA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.respuesta ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <textarea id="respuesta" placeholder="Ingrese la respuesta de la pregunta frecuente" rows={4}
                                        value={faqEditar.respuesta} onChange={(e) => {
                                            setFaqEditar({ ...faqEditar, respuesta: e.target.value })
                                            if (erroresActualizar.respuesta) setErroresActualizar({ ...erroresActualizar, respuesta: undefined });
                                        }}
                                        className={`w-full text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none ${erroresActualizar.respuesta ? 'placeholder:text-destructive/50' : ''}`}
                                    />
                                </InputGroup>
                                {erroresActualizar.respuesta && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.respuesta}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarFaq(false); setErroresActualizar({}) }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}