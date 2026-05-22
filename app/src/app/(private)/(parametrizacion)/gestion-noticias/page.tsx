"use client";

// Componentes de interfaz
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectItem, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast-custom";
import FileUploadField from "@/components/ui/fileUpload";

// Iconos
import { MessageSquarePlus, CalendarRange, FileEdit, CircleX, Info, TextSearch } from 'lucide-react';

// Utilidades
import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Noticia } from "@/DTOs/noticia";

// Uso de hooks que interactuan con la API
import { useNoticias } from "@/hooks/use-noticia";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { usePlanificacion } from "@/hooks/use-planificacion";
import { environment } from "@/lib/api/client";

export default function GestionNoticias() {
    const { registrarNoticia, obtenerNoticias, eliminarNoticia, actualizarNoticia, obtenerNoticiaPorId, loading: loadingNoticias } = useNoticias();
    const { obtenerPlanificacionVigente, loading: loadingPlanificacion } = usePlanificacion();
    const drawerDirection = useDrawerDirection();

    // Listado de noticias
    const [noticias, setNoticias] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);

    // Planificacion vigente
    const [planificacionVigente, setPlanificacionVigente] = useState<any>(null);

    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<{
        titulo?: string,
        descripcion?: string,
        prioridad?: string
    }>({});

    const [erroresActualizar, setErroresActualizar] = useState<{
        titulo?: string,
        descripcion?: string,
        prioridad?: string
    }>({});

    // Llamada asincrona reutilizable
    const cargarNoticias = async () => {
        try {
            const res = await obtenerNoticias(busqueda);
            setNoticias(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener noticias:", error.message);
            toast.error(error.message);
        }
    };

    const cargarPlanificacionVigente = async () => {
        try {
            const res = await obtenerPlanificacionVigente();
            setPlanificacionVigente(res.data);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener planificacion vigente:", error.message);
            //toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => {
        cargarNoticias();
        cargarPlanificacionVigente();
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

    // Registro de noticias
    const [isOpenNuevaNoticia, setIsOpenNuevaNoticia] = useState(false);

    const [noticia, setNoticia] = useState<Noticia>({
        titulo: "",
        descripcion: "",
        prioridad: "",
        idPlanificacion: "",
        imagen: null as unknown as File,
        idEncargadoGenerar: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { titulo?: string, descripcion?: string, prioridad?: string } = {};
        if (!noticia.titulo.trim()) nuevosErrores.titulo = "El titulo de la noticia es requerido";
        if (!noticia.descripcion.trim()) nuevosErrores.descripcion = "La descripcion de la noticia es requerida";
        if (!noticia.prioridad.trim()) nuevosErrores.prioridad = "La prioridad de la noticia es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await registrarNoticia({ ...noticia, idEncargadoGenerar: user._id, idPlanificacion: planificacionVigente._id });
            // Recarga la lista de noticias
            await cargarNoticias();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setNoticia({
                titulo: "",
                descripcion: "",
                prioridad: "",
                idPlanificacion: "",
                imagen: null as unknown as File,
                idEncargadoGenerar: ""
            });
            setIsOpenNuevaNoticia(false);

        } catch (error: any) {
            console.error("Error al registrar noticia:", error.message);
            toast.error(error.message);
        }
    };

    // Eliminacion de una noticia
    const handleEliminarNoticia = async (id: string) => {
        try {
            const res = await eliminarNoticia(id);
            await cargarNoticias();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al eliminar la noticia:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar noticia
    const [isOpenEditarNoticia, setIsOpenEditarNoticia] = useState(false);
    const [noticiaEditar, setNoticiaEditar] = useState<Noticia>({
        titulo: "",
        descripcion: "",
        prioridad: "",
        imagen: null as unknown as File,
        idEncargadoGenerar: ""
    });
    const [noticiaEditarId, setNoticiaEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (noticia: any) => {
        try {
            const res = await obtenerNoticiaPorId(noticia._id);
            const noticiaData = res.data;
            setNoticiaEditar(noticiaData);
            setNoticiaEditarId(noticia._id);
            setIsOpenEditarNoticia(true);
        } catch (error: any) {
            console.error("Error al obtener noticia para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { titulo?: string, descripcion?: string, prioridad?: string } = {};
        if (!noticiaEditar.titulo.trim()) nuevosErrores.titulo = "El titulo de la noticia es requerido";
        if (!noticiaEditar.descripcion.trim()) nuevosErrores.descripcion = "La descripcion de la noticia es requerida";
        if (!noticiaEditar.prioridad.trim()) nuevosErrores.prioridad = "La prioridad de la noticia es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await actualizarNoticia(noticiaEditarId, { ...noticiaEditar, idEncargadoActualizar: user._id });
            setIsOpenEditarNoticia(false);
            await cargarNoticias();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar:", error.message);
            toast.error(error.message);
        }
    };

    const formatearFecha = (fecha: any) => {
        if (!fecha) return "S/N";
        return new Date(fecha).toLocaleDateString("es-EC", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Modal con detalle de la noticia
    const [isOpenDetalleNoticia, setIsOpenDetalleNoticia] = useState(false);
    const [detalleNoticia, setDetalleNoticia] = useState<any>();

    // Abrir modal con detalle de la noticia
    const handleDetalle = async (noticia: any) => {
        try {
            setDetalleNoticia(noticia);
            setIsOpenDetalleNoticia(true);
        } catch (error: any) {
            console.error("Error al obtener detalle de la noticia:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="container mx-auto">
            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de noticias</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Publique novedades generadas a lo largo del periodo académico a los estudiantes.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevaNoticia(!isOpenNuevaNoticia)}>
                        <MessageSquarePlus /> Nueva noticia
                    </Button>
                </div>
            </div>

            {/** Listado de noticias */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <CalendarRange className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Periodo actual</CardTitle>
                                <CardDescription className="font-bold text-lg">{planificacionVigente?.periodo || 'S/N'}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de noticias</p>
                {/** Buscador */}
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por titulo..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Titulo</TableHead>
                            <TableHead className="text-center">Prioridad</TableHead>
                            <TableHead className="text-center">Generado por</TableHead>
                            <TableHead className="text-center">Fecha de publicación</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {noticias.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No hay noticias registradas
                                </TableCell>
                            </TableRow>
                        )}
                        {noticias.map((noticia, i) => (
                            <TableRow key={noticia._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{noticia.titulo}</TableCell>
                                <TableCell>{noticia.prioridad}</TableCell>
                                <TableCell>{noticia.idEncargadoGenerar.nombres + ' ' + noticia.idEncargadoGenerar.apellidos}</TableCell>
                                <TableCell>{
                                    noticia.fechaActualizacion ? (
                                        formatearFecha(noticia.fechaActualizacion)
                                    ) : (
                                        formatearFecha(noticia.fechaRegistro)
                                    )
                                }</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDetalle(noticia)}>
                                                    <Info className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Detalle</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleEditar(noticia)}>
                                                    <FileEdit className="text-warning" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleEliminarNoticia(noticia._id)}>
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

            {/** Drawer de registro de noticias */}
            <Drawer open={isOpenNuevaNoticia} onOpenChange={setIsOpenNuevaNoticia} direction={drawerDirection}
                onClose={() => {
                    setNoticia({ titulo: '', descripcion: '', prioridad: "", idPlanificacion: '', imagen: null as unknown as File, idEncargadoGenerar: '' });
                    setErroresRegistro({})
                }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Noticia</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar la noticia.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-scroll" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="titulo" className="text-xs">TITULO DE LA NOTICIA/AVISO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.titulo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="titulo" type="text" placeholder="Ingrese el titulo para la noticia, aviso o comunicado"
                                        value={noticia.titulo} onChange={(e) => {
                                            setNoticia({ ...noticia, titulo: e.target.value });
                                            if (erroresRegistro.titulo) setErroresRegistro({ ...erroresRegistro, titulo: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.titulo ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.titulo && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.titulo}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <textarea id="descripcion" placeholder="Ingrese la descripcion del instrumento" rows={4}
                                        value={noticia.descripcion} onChange={(e) => {
                                            setNoticia({ ...noticia, descripcion: e.target.value });
                                            if (erroresRegistro.descripcion) setErroresRegistro({ ...erroresRegistro, descripcion: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.descripcion ? 'placeholder:text-destructive/50' : ''} resize-none outline-none`} />
                                </InputGroup>
                                {erroresRegistro.descripcion && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.descripcion}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="prioridad" className="text-xs">PRIORIDAD</FieldLabel>
                                <Select defaultValue={noticia.prioridad}
                                    onValueChange={(e) => {
                                        setNoticia({ ...noticia, prioridad: e });
                                        if (erroresRegistro.prioridad) setErroresRegistro({ ...erroresRegistro, prioridad: undefined });
                                    }}>
                                    <SelectTrigger className={`w-full ${erroresRegistro.prioridad ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                        <SelectValue placeholder="Indique la prioridad de su comunicado" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="Baja">Baja</SelectItem>
                                            <SelectItem value="Media">Media</SelectItem>
                                            <SelectItem value="Alta">Alta</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {erroresRegistro.prioridad && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.prioridad}</p>
                                )}
                            </Field>
                            <Field>
                                <FileUploadField id="imagen" label="IMAGEN" accept=".jpg,.png,.jpeg"
                                    onChange={(file) =>
                                        setNoticia({ ...noticia, imagen: file as File })
                                    }
                                />
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loadingNoticias}>
                                {loadingNoticias ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevaNoticia(false); setErroresRegistro({}) }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de noticias */}
            <Drawer open={isOpenEditarNoticia} onOpenChange={setIsOpenEditarNoticia} direction={drawerDirection}
                onClose={() => {
                    setNoticia({ titulo: '', descripcion: '', prioridad: "", imagen: null as unknown as File, idEncargadoActualizar: '' });
                    setErroresActualizar({})
                }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Noticia</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para editar la noticia.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-scroll" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="titulo" className="text-xs">TITULO DE LA NOTICIA/AVISO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.titulo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="titulo" type="text" placeholder="Ingrese el titulo para la noticia, aviso o comunicado" required
                                        value={noticiaEditar.titulo} onChange={(e) => {
                                            setNoticiaEditar({ ...noticiaEditar, titulo: e.target.value });
                                            if (erroresActualizar.titulo) setErroresActualizar({ ...erroresActualizar, titulo: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.titulo ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.titulo && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.titulo}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <textarea id="descripcion" placeholder="Ingrese la descripcion del instrumento" rows={4}
                                        value={noticiaEditar.descripcion} onChange={(e) => {
                                            setNoticiaEditar({ ...noticiaEditar, descripcion: e.target.value })
                                            if (erroresActualizar.descripcion) setErroresActualizar({ ...erroresActualizar, descripcion: undefined });
                                        }}
                                        className={`w-full text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none ${erroresActualizar.descripcion ? 'placeholder:text-destructive/50' : ''}`}
                                    />
                                </InputGroup>
                                {erroresActualizar.descripcion && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.descripcion}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="prioridad" className="text-xs">PRIORIDAD</FieldLabel>
                                <Select onValueChange={(e) => {
                                    setNoticiaEditar({ ...noticiaEditar, prioridad: e.toString() });
                                    if (erroresActualizar.prioridad) setErroresActualizar({ ...erroresActualizar, prioridad: undefined });
                                }} defaultValue={noticiaEditar.prioridad} required>
                                    <SelectTrigger className={`w-full ${erroresActualizar.prioridad ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                        <SelectValue placeholder="Indique la prioridad de su comunicado" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="Baja">Baja</SelectItem>
                                            <SelectItem value="Media">Media</SelectItem>
                                            <SelectItem value="Alta">Alta</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {erroresActualizar.prioridad && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.prioridad}</p>
                                )}
                            </Field>
                            <Field>
                                {typeof noticiaEditar.imagen === 'string' && (
                                    <div className="relative flex items-center justify-center p-3 bg-secondary rounded-md mb-2">
                                        <img src={`${environment.baseUrl}/${noticiaEditar.imagen}`} alt="Imagen" className="object-cover w-45 h-45" />
                                        {/* Eliminar la imagen actual */}
                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 hover:bg-destructive/10 h-6 w-6"
                                            onClick={() => setNoticiaEditar({ ...noticiaEditar, imagen: null as unknown as File })}>
                                            <CircleX className="text-destructive h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                {typeof noticiaEditar.imagen !== 'string' && (
                                    <FileUploadField id="imagen" label="NUEVA IMAGEN" accept=".jpg,.png,.jpeg"
                                        onChange={(file) => setNoticiaEditar({ ...noticiaEditar, imagen: file as File })}
                                    />
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loadingNoticias}>
                                {loadingNoticias ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarNoticia(false); setErroresActualizar({}) }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Modal para mostrar el detalle de la noticia */}
            <Dialog open={isOpenDetalleNoticia} onOpenChange={setIsOpenDetalleNoticia}>
                <DialogContent className="overflow-x-auto sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Detalle {detalleNoticia?.titulo}</DialogTitle>
                        <DialogDescription className="text-xs lg:text-sm">
                            Revise el detalle de su comunicado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 no-scrollbar max-h-[50vh] overflow-y-auto">
                        <p className="px-1 text-sm">{detalleNoticia?.descripcion}</p>
                        {detalleNoticia?.imagen && (
                            <div className="relative flex items-center justify-center p-3 bg-secondary rounded-md mt-2">
                                <img src={`${environment.baseUrl}/${detalleNoticia.imagen}`} alt="Imagen" className="object-cover w-45 h-45" />
                            </div>
                        )}
                        <div className="px-4 flex items-center justify-between mt-4">
                            <div className="flex flex-col gap-2">
                                <Badge variant="secondary">{detalleNoticia?.idEncargadoGenerar?.nombres + " " + detalleNoticia?.idEncargadoGenerar?.apellidos}</Badge>
                                <Badge variant="outline" className="text-xs">{formatearFecha(detalleNoticia?.fechaRegistro)}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="text-xs font-medium">Prioridad:</p>
                                <Badge variant="default">{detalleNoticia?.prioridad}</Badge>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}