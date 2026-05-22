"use client";

import { toast } from "@/components/ui/toast-custom";

import { GitBranchPlus, GitFork, FileEdit, CircleX, Plus, Trash2, ToggleLeft, ToggleRight, Info, FileDown, TextSearch } from 'lucide-react';

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { useSubprocesos } from "@/hooks/use-subproceso";
import { useInstrumentos } from "@/hooks/use-instrumento";
import { useCargos } from "@/hooks/use-cargo";
import { Busqueda } from "@/constants/busqueda";
import { Subproceso } from "@/DTOs/subproceso";
import { Actividad } from "@/DTOs/actividad";
import { environment } from "@/lib/api/client";

const actividadVacia = (): Actividad => ({
    nombre: "",
    descripcion: "",
    idParticipante: "",
    instrumentos: [],
});

const subprocesoVacio = (): Subproceso => ({
    identificador: "",
    nombre: "",
    descripcion: "",
    orden: 0,
    actividades: [actividadVacia()],
    idEncargadoGenerar: "",
    idEncargadoActualizar: ""
});

type ErroresActividad = {
    nombre?: string;
    descripcion?: string;
    idParticipante?: string;
};

type ErroresSubproceso = {
    identificador?: string;
    orden?: string;
    nombre?: string;
    descripcion?: string;
    actividades?: ErroresActividad[];
};

export default function GestionSubprocesos() {
    // Hooks de subproceso
    const { registrarSubproceso, obtenerSubprocesos, actualizarEstadoSubproceso, actualizarSubproceso, obtenerSubprocesoPorId, contarSubprocesosActivos, loading } = useSubprocesos();
    // Utilidades para obtener cargos (actores) e instrumentos
    const { listarInstrumentos } = useInstrumentos();
    const { listarCargos } = useCargos();
    // Hook para dirección del drawer
    const drawerDirection = useDrawerDirection();

    // Listado de subprocesos
    const [subprocesos, setSubprocesos] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    // Total subprocesos
    const [totalSubprocesos, setTotalSubprocesos] = useState(0);
    // Configuracion de paginación
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<ErroresSubproceso>({});
    const [erroresActualizar, setErroresActualizar] = useState<ErroresSubproceso>({});

    // Listados de instrumentos y cargos
    const [instrumentosDisponibles, setInstrumentosDisponibles] = useState<any[]>([]);
    const [cargosDisponibles, setCargosDisponibles] = useState<any[]>([]);

    // Registro de subprocesos
    const [isOpenNuevoSubproceso, setIsOpenNuevoSubproceso] = useState(false);
    const [subproceso, setSubproceso] = useState<Subproceso>(subprocesoVacio());

    // Actualización de subprocesos
    const [isOpenActualizarSubproceso, setIsOpenActualizarSubproceso] = useState(false);
    const [subprocesoActualizar, setSubprocesoActualizar] = useState<Subproceso>(subprocesoVacio());
    const [subprocesoActualizarId, setSubprocesoActualizarId] = useState<string>("");

    // Listado de subprocesos
    const cargarSubprocesos = async () => {
        try {
            const res = await obtenerSubprocesos(busqueda);
            const res2 = await contarSubprocesosActivos();
            setSubprocesos(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalSubprocesos(res2.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener subprocesos:", error.message);
            toast.error(error.message);
        }
    };

    // Carga de instrumentos y cargos
    const cargarSelectores = async () => {
        try {
            // Llamada concurrente
            const [resInst, resCargos] = await Promise.all([
                listarInstrumentos(),
                listarCargos(),
            ]);
            setInstrumentosDisponibles(resInst.data);
            setCargosDisponibles(resCargos.data);
        } catch (error: any) {
            console.error("Error al cargar selectores:", error.message);
            toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => { cargarSubprocesos(); }, [busqueda]);
    useEffect(() => { cargarSelectores(); }, []);

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

    // Helper de actividades -> actualizar actividad
    const actualizarActividad = (index: number, campo: keyof Actividad, valor: any) => {
        setSubproceso(prev => {
            const acts = [...prev.actividades];
            acts[index] = { ...acts[index], [campo]: valor };
            return { ...prev, actividades: acts };
        });
    };

    const actualizarActividadEditar = (index: number, campo: keyof Actividad, valor: any) => {
        setSubprocesoActualizar(prev => {
            const acts = [...prev.actividades];
            acts[index] = { ...acts[index], [campo]: valor };
            return { ...prev, actividades: acts };
        });
    };

    // Toggle de instrumento dentro de una actividad
    const toggleInstrumento = (indexAct: number, idInstrumento: string) => {
        setSubproceso(prev => {
            const acts = [...prev.actividades];
            const seleccionados = acts[indexAct].instrumentos;
            acts[indexAct] = {
                ...acts[indexAct],
                instrumentos: seleccionados.includes(idInstrumento)
                    ? seleccionados.filter((id: any) => id !== idInstrumento)
                    : [...seleccionados, idInstrumento],
            };
            return { ...prev, actividades: acts };
        });
    };

    const toggleInstrumentoEditar = (indexAct: number, idInstrumento: string) => {
        setSubprocesoActualizar(prev => {
            const acts = [...prev.actividades];
            const seleccionados = acts[indexAct].instrumentos;
            acts[indexAct] = {
                ...acts[indexAct],
                instrumentos: seleccionados.includes(idInstrumento)
                    ? seleccionados.filter((id: any) => id !== idInstrumento)
                    : [...seleccionados, idInstrumento],
            };
            return { ...prev, actividades: acts };
        });
    };

    // Agregar nueva actividad
    const agregarActividad = (index: number, posicion: "arriba" | "abajo") => {
        setSubproceso(prev => {
            const actividades = [...prev.actividades];

            // Calcular dónde insertar
            const nuevoIndex = posicion === "arriba" ? index : index + 1;

            // Insertar sin reemplazar
            actividades.splice(nuevoIndex, 0, actividadVacia());

            return {
                ...prev,
                actividades
            };
        });
    };

    // Agregar nueva actividad editar
    const agregarActividadEditar = (index: number, posicion: "arriba" | "abajo") => {
        setSubprocesoActualizar(prev => {
            const actividades = [...prev.actividades];

            const nuevoIndex = posicion === "arriba" ? index : index + 1;

            actividades.splice(nuevoIndex, 0, actividadVacia());

            return {
                ...prev,
                actividades
            };
        });
    };

    // Eliminar actividad
    const eliminarActividad = (index: number) =>
        setSubproceso((prev: any) => ({
            ...prev,
            actividades: prev.actividades.filter((_: any, i: any) => i !== index),
        }));

    const eliminarActividadEditar = (index: number) =>
        setSubprocesoActualizar((prev: any) => ({
            ...prev,
            actividades: prev.actividades.filter((_: any, i: any) => i !== index),
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores = validarSubproceso(subproceso);
        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete los campos obligatorios del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await registrarSubproceso({ ...subproceso, idEncargadoGenerar: user._id });
            setSubproceso(subprocesoVacio());
            setIsOpenNuevoSubproceso(false);
            await cargarSubprocesos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al registrar subproceso: ", error.message);
            toast.error(error.message);
        }
    };

    const handleCambioEstado = async (id: string, estado: number) => {
        try {
            const res = await actualizarEstadoSubproceso(id, { estado });
            await cargarSubprocesos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado del subproceso: ", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores = validarSubproceso(subprocesoActualizar);

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete los campos obligatorios del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await actualizarSubproceso(subprocesoActualizarId, { ...subprocesoActualizar, idEncargadoActualizar: user._id });
            setSubprocesoActualizar(subprocesoVacio());
            setIsOpenActualizarSubproceso(false);
            await cargarSubprocesos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar subproceso: ", error.message);
            toast.error(error.message);
        }
    };

    const handleEditar = async (subproceso: any) => {
        try {
            const res = await obtenerSubprocesoPorId(subproceso._id);
            const data = res.data;
            // Normalización de data
            data.actividades = data.actividades.map((act: any) => ({
                ...act,
                idParticipante: act.idParticipante?._id || "",
                instrumentos: act.instrumentos?.map((i: any) => i._id) || []
            }));
            setSubprocesoActualizar(data);
            setSubprocesoActualizarId(subproceso._id);
            setIsOpenActualizarSubproceso(true);
        } catch (error: any) {
            console.error("Error al obtener subproceso para editar:", error.message);
            toast.error(error.message);
        }
    };

    // Detalle de actividades de un subproceso
    const [isOpenDetalleSubproceso, setIsOpenDetalleSubproceso] = useState(false);
    const [detalleSubproceso, setDetalleSubproceso] = useState<any>(null);

    const handleDetalle = async (subproceso: any) => {
        try {
            const res = await obtenerSubprocesoPorId(subproceso._id);
            setDetalleSubproceso(res.data);
            setIsOpenDetalleSubproceso(true);
        } catch (error: any) {
            console.error("Error al obtener detalle del subproceso:", error.message);
            toast.error(error.message);
        }
    };

    // Descargar achivo de un instrumento
    const handleDescarga = (instrumento: any) => {
        const url = `${environment.baseUrl}/${instrumento.archivo}`;
        window.open(url, '_blank'); // Abre en otra pestaña
    };

    let contadorInstrumentos = 0;
    const obtenerIdentificadorInstrumento = (actividad: any, instrumentoIndex: number) => {
        // Solo el primer instrumento de la actividad incrementa
        if (instrumentoIndex === 0) {
            contadorInstrumentos++;
        }

        // fromCharCode convierte número a letra
        const sufijo = actividad.instrumentos.length > 1 ? `.${String.fromCharCode(97 + instrumentoIndex)}` : "";

        return `IT-${detalleSubproceso.identificador}-${contadorInstrumentos}${sufijo}.`;
    };

    // Instrumentos ya seleccionados en otras actividades
    const obtenerInstrumentosDisponibles = (indexActual: number) => {
        // Obtener ids usados en otras actividades
        const instrumentosUsados = subproceso.actividades
            .filter((_, index) => index !== indexActual)
            .flatMap(act => act.instrumentos); // flat aplana y map extrae -> se evita arrays dentro de array

        // Filtrar los disponibles
        return instrumentosDisponibles.filter(
            inst => !instrumentosUsados.includes(inst._id)
        );
    };

    const obtenerInstrumentosDisponiblesEditar = (indexActual: number) => {
        const instrumentosUsados = subprocesoActualizar.actividades
            .filter((_, index) => index !== indexActual)
            .flatMap(act => act.instrumentos);

        return instrumentosDisponibles.filter(
            inst => !instrumentosUsados.includes(inst._id)
        );
    };

    const validarSubproceso = (sp: Subproceso): ErroresSubproceso => {
        const nuevosErrores: ErroresSubproceso = {};

        if (!sp.identificador.trim()) nuevosErrores.identificador = "El identificador del subproceso es requerido";
        if (!sp.orden || sp.orden === 0) nuevosErrores.orden = "El orden a ocupar es requerido";
        if (!sp.nombre.trim()) nuevosErrores.nombre = "El nombre del subproceso es requerido";
        if (!sp.descripcion) nuevosErrores.descripcion = "La descripción del subproceso es requerida";

        const erroresActividades = sp.actividades.map(act => {
            const err: ErroresActividad = {};
            if (!act.nombre.trim()) err.nombre = "El nombre de la actividad es requerido";
            if (!act.idParticipante) err.idParticipante = "El participante de la actividad es requerido";
            if (!act.descripcion) err.descripcion = "La descripción de la actividad es requerida";
            return err;
        });

        // Solo incluir si hay al menos un error en alguna actividad
        if (erroresActividades.some(e => Object.keys(e).length > 0)) {
            nuevosErrores.actividades = erroresActividades;
        }

        return nuevosErrores;
    };

    return (
        <div className="container mx-auto">

            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de subprocesos</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Configure el flujo secuencial y detalles para la titulación.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoSubproceso(true)}>
                        <GitBranchPlus /> Nuevo subproceso
                    </Button>
                </div>
            </div>

            {/** Listado subprocesos */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <GitFork className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Subprocesos</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalSubprocesos}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>

                <p className="p-4 font-bold text-sm md:text-md">Listado de subprocesos</p>
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por identificador o nombre..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Orden</TableHead>
                            <TableHead className="text-center">Identificador</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Descripción</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {subprocesos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No hay subprocesos registrados
                                </TableCell>
                            </TableRow>
                        )}
                        {subprocesos.map((sp, i) => (
                            <TableRow key={sp._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{sp.identificador}</TableCell>
                                <TableCell className="max-w-sm whitespace-normal wrap-break-word">{sp.nombre}</TableCell>
                                <TableCell className="max-w-xl whitespace-normal wrap-break-word">{sp.descripcion}</TableCell>
                                <TableCell>
                                    {sp.estado == 1
                                        ? <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Activo</Badge>
                                        : <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">Inactivo</Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDetalle(sp)} >
                                                    <Info className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Detalle</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(sp)} >
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        {sp.estado === 1 ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleCambioEstado(sp._id, 0)}>
                                                        <ToggleRight className="text-warning" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desactivar</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-success/60" onClick={() => handleCambioEstado(sp._id, 1)}>
                                                        <ToggleLeft className="text-success-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Activar</TooltipContent>
                                            </Tooltip>
                                        )}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(sp._id, 2)}>
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
                        <PaginationItem>
                            <PaginationPrevious href="#" className={!anterior ? "pointer-events-none opacity-50" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!anterior) return;
                                    setBusqueda(p => ({ ...p, pagina: p.pagina - 1 }));
                                }} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink isActive href="#">{busqueda.pagina}</PaginationLink>
                        </PaginationItem>
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

            {/** Drawer de registro */}
            <Drawer open={isOpenNuevoSubproceso} onOpenChange={setIsOpenNuevoSubproceso} direction={drawerDirection} onClose={() => { setSubproceso(subprocesoVacio()); setErroresRegistro({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro de subproceso</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Complete la información del subproceso y sus actividades.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleSubmit}>
                        {/** Datos del subproceso */}
                        <section className="space-y-4">
                            <p className="font-semibold text-sm text-muted-foreground">SUBPROCESO</p>
                            <FieldGroup>
                                <div className="flex items-center justify-between gap-2">
                                    <Field>
                                        <FieldLabel htmlFor="identificador" className="text-xs">ID SUBPROCESO</FieldLabel>
                                        <InputGroup className={`py-5 px-2 ${erroresRegistro.identificador ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                            <InputGroupInput id="identificador" type="text" placeholder="OM, AT, ..."
                                                value={subproceso.identificador} onChange={e => {
                                                    setSubproceso(p => ({ ...p, identificador: e.target.value }));
                                                    if (erroresRegistro.identificador) setErroresRegistro(p => ({ ...p, identificador: undefined }));
                                                }}
                                                className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.identificador ? 'placeholder:text-destructive/50' : ''}`} />
                                        </InputGroup>
                                        {erroresRegistro.identificador && (
                                            <p className="text-destructive text-xs mt-1">{erroresRegistro.identificador}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="orden" className="text-xs">ORDEN</FieldLabel>
                                        <Select value={subproceso.orden === 0 ? undefined : String(subproceso.orden)}
                                            onValueChange={(e) => {
                                                setSubproceso({ ...subproceso, orden: Number(e) })
                                                if (erroresRegistro.orden) setErroresRegistro({ ...erroresRegistro, orden: undefined });
                                            }}>
                                            <SelectTrigger className={`py-5 px-2 w-full ${erroresRegistro.orden ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                                <SelectValue placeholder="Indique el orden" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectGroup>
                                                    {Array.from(
                                                        { length: totalSubprocesos + 1 },
                                                        (_, i) => (
                                                            <SelectItem key={i + 1} value={String(i + 1)} className="text-xs md:text-sm">
                                                                {i + 1}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {erroresRegistro.orden && (
                                            <p className="text-xs text-destructive mt-1">{erroresRegistro.orden}</p>
                                        )}
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE</FieldLabel>
                                    <InputGroup className={`py-5 px-2 ${erroresRegistro.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                        <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del subproceso"
                                            value={subproceso.nombre} onChange={e => {
                                                setSubproceso(p => ({ ...p, nombre: e.target.value }));
                                                if (erroresRegistro.nombre) setErroresRegistro({ ...erroresRegistro, nombre: undefined });
                                            }}
                                            className={`text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                    </InputGroup>
                                    {erroresRegistro.nombre && (
                                        <p className="text-xs text-destructive mt-1">{erroresRegistro.nombre}</p>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCIÓN</FieldLabel>
                                    <InputGroup className={`py-5 px-2 ${erroresRegistro.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                        <textarea id="descripcion" rows={4} placeholder="Ingrese la descripción del subproceso"
                                            value={subproceso.descripcion} onChange={e => {
                                                setSubproceso(p => ({ ...p, descripcion: e.target.value }));
                                                if (erroresRegistro.descripcion) setErroresRegistro({ ...erroresRegistro, descripcion: undefined });
                                            }}
                                            className={`w-full text-xs md:text-xs placeholder:text-muted-foreground/50 resize-none outline-none bg-transparent placeholder:text-xs ${erroresRegistro.descripcion ? 'placeholder:text-destructive/50' : ''}`} />
                                    </InputGroup>
                                    {erroresRegistro.descripcion && (
                                        <p className="text-xs text-destructive mt-1">{erroresRegistro.descripcion}</p>
                                    )}
                                </Field>
                            </FieldGroup>
                        </section>

                        {/** Datos de las actividades */}
                        <section className="space-y-2 mt-4">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-muted-foreground">ACTIVIDADES</p>
                                {/* <Button type="button" variant="default" size="sm" onClick={agregarActividad}>
                                    <Plus className="w-4 h-4" /> Agregar actividad
                                </Button> */}
                            </div>

                            {subproceso.actividades.map((act, index) => (
                                <div key={index} className="border border-dashed rounded-lg p-4 space-y-4 relative">
                                    <div className="flex items-center justify-end mt-4">
                                        {subproceso.actividades.length > 1 && (
                                            <Button type="button" variant="default" size="sm" onClick={() => agregarActividad(index, "arriba")}>
                                                <Plus className="w-4 h-4" /> Agregar actividad antes
                                            </Button>
                                        )}
                                    </div>

                                    {/** Cabecera de actividad */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            ACTIVIDAD Nro. {index + 1}
                                        </span>
                                        {subproceso.actividades.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm"
                                                className="hover:bg-destructive/10"
                                                onClick={() => eliminarActividad(index)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>

                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel className="text-xs">NOMBRE ACTIVIDAD</FieldLabel>
                                            <InputGroup className={`py-5 px-2 ${erroresRegistro.actividades?.[index]?.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                                <InputGroupInput type="text" placeholder="Nombre de la actividad"
                                                    value={act.nombre}
                                                    onChange={e => {
                                                        actualizarActividad(index, "nombre", e.target.value);
                                                        if (erroresRegistro.actividades?.[index]?.nombre) {
                                                            setErroresRegistro(prev => {
                                                                const acts = [...(prev.actividades || [])];
                                                                acts[index] = { ...acts[index], nombre: undefined };
                                                                return { ...prev, actividades: acts };
                                                            });
                                                        }
                                                    }}
                                                    className={`text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.actividades?.[index]?.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                            </InputGroup>
                                            {erroresRegistro.actividades?.[index]?.nombre && (
                                                <p className="text-xs text-destructive mt-1">{erroresRegistro.actividades[index].nombre}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">DESCRIPCIÓN ACTIVIDAD</FieldLabel>
                                            <InputGroup className={`py-5 px-2 ${erroresRegistro.actividades?.[index]?.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                                <textarea rows={3} placeholder="Descripción de la actividad"
                                                    value={act.descripcion}
                                                    onChange={e => {
                                                        actualizarActividad(index, "descripcion", e.target.value);
                                                        if (erroresRegistro.actividades?.[index]?.descripcion) {
                                                            setErroresRegistro(prev => {
                                                                const acts = [...(prev.actividades || [])];
                                                                acts[index] = { ...acts[index], descripcion: undefined };
                                                                return { ...prev, actividades: acts };
                                                            });
                                                        }
                                                    }}
                                                    className={`w-full text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-xs resize-none outline-none bg-transparent ${erroresRegistro.actividades?.[index]?.descripcion ? 'placeholder:text-destructive/50' : ''}`} />
                                            </InputGroup>
                                            {erroresRegistro.actividades?.[index]?.descripcion && (
                                                <p className="text-xs text-destructive mt-1">{erroresRegistro.actividades[index].descripcion}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">PARTICIPANTE</FieldLabel>
                                            <Select value={act.idParticipante}
                                                onValueChange={(e) => {
                                                    actualizarActividad(index, "idParticipante", e);
                                                    if (erroresRegistro.actividades?.[index]?.idParticipante) setErroresRegistro(prev => {
                                                        const acts = [...(prev.actividades || [])];
                                                        acts[index] = { ...acts[index], idParticipante: undefined };
                                                        return { ...prev, actividades: acts };
                                                    });
                                                }}>
                                                <SelectTrigger className={`w-full ${erroresRegistro.actividades?.[index]?.idParticipante ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                                    <SelectValue placeholder="Seleccione un participante" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectGroup>
                                                        {cargosDisponibles.map(cargo => (
                                                            <SelectItem key={cargo._id} value={cargo._id} className="text-xs md:text-sm">
                                                                {cargo.nombre}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {erroresRegistro.actividades?.[index]?.idParticipante && (
                                                <p className="text-xs text-destructive mt-1">{erroresRegistro.actividades[index].idParticipante}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">INSTRUMENTOS</FieldLabel>
                                            <div className="border rounded-md p-3 bg-secondary max-h-40 overflow-y-auto space-y-2">
                                                {instrumentosDisponibles.length === 0 && (
                                                    <p className="text-xs text-muted-foreground">No hay instrumentos disponibles</p>
                                                )}
                                                {obtenerInstrumentosDisponibles(index).map(inst => (
                                                    <label key={inst._id}
                                                        className="flex items-center gap-2 cursor-pointer text-xs hover:text-primary">
                                                        <input type="checkbox"
                                                            checked={act.instrumentos.includes(inst._id)}
                                                            onChange={() => toggleInstrumento(index, inst._id)}
                                                            className="accent-primary"
                                                        />
                                                        <span>{inst.nombre}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {act.instrumentos.length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {act.instrumentos.length} instrumento(s) seleccionado(s)
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                    <div className="flex items-center justify-end mt-4">
                                        <Button type="button" variant="default" size="sm" onClick={() => agregarActividad(index, "abajo")}>
                                            <Plus className="w-4 h-4" /> Agregar actividad después
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevoSubproceso(false); setErroresRegistro({}) }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de actualización */}
            <Drawer open={isOpenActualizarSubproceso} onOpenChange={setIsOpenActualizarSubproceso} direction={drawerDirection} onClose={() => { setSubprocesoActualizar(subprocesoVacio()); setErroresActualizar({}) }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Actualizar subproceso</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Complete la información del subproceso y sus actividades.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleActualizar}>
                        {/** Datos del subproceso */}
                        <section className="space-y-4">
                            <p className="font-semibold text-sm text-muted-foreground">SUBPROCESO</p>
                            <FieldGroup>
                                <div className="flex items-center justify-between gap-2">
                                    <Field>
                                        <FieldLabel htmlFor="identificador" className="text-xs">ID SUBPROCESO</FieldLabel>
                                        <InputGroup className={`py-5 px-2 ${erroresActualizar.identificador ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                            <InputGroupInput id="identificador" type="text" placeholder="OM, AT, ..."
                                                value={subprocesoActualizar.identificador} onChange={e => {
                                                    setSubprocesoActualizar(p => ({ ...p, identificador: e.target.value }));
                                                    if (erroresActualizar.identificador) setErroresActualizar(p => ({ ...p, identificador: "" }))
                                                }}
                                                className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.identificador ? 'placeholder:text-destructive/50' : ''}`} />
                                        </InputGroup>
                                        {erroresActualizar.identificador && (
                                            <p className="text-xs text-destructive mt-1">{erroresActualizar.identificador}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="orden" className="text-xs">ORDEN</FieldLabel>
                                        <Select value={String(subprocesoActualizar.orden)}
                                            onValueChange={(e) => {
                                                setSubprocesoActualizar(p => ({ ...p, orden: Number(e) }))
                                                if (erroresActualizar.orden) setErroresActualizar(p => ({ ...p, orden: undefined }));
                                            }}>
                                            <SelectTrigger className={`py-5 px-2 w-full ${erroresActualizar.orden ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                                <SelectValue placeholder="Indique el orden" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectGroup>
                                                    {Array.from(
                                                        { length: totalSubprocesos },
                                                        (_, i) => (
                                                            <SelectItem key={i + 1} value={String(i + 1)} className="text-xs md:text-sm">
                                                                {i + 1}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {erroresActualizar.orden && (
                                            <p className="text-xs text-destructive mt-1">{erroresActualizar.orden}</p>
                                        )}
                                    </Field>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE</FieldLabel>
                                    <InputGroup className={`py-5 px-2 ${erroresActualizar.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                        <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del subproceso"
                                            value={subprocesoActualizar.nombre} onChange={e => {
                                                setSubprocesoActualizar(p => ({ ...p, nombre: e.target.value }));
                                                if (erroresActualizar.nombre) setErroresActualizar(p => ({ ...p, nombre: undefined }));
                                            }}
                                            className={`text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                    </InputGroup>
                                    {erroresActualizar.nombre && (
                                        <p className="text-xs text-destructive mt-1">{erroresActualizar.nombre}</p>
                                    )}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCIÓN</FieldLabel>
                                    <InputGroup className={`py-5 px-2 ${erroresActualizar.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                        <textarea id="descripcion" rows={4} placeholder="Ingrese la descripción del subproceso"
                                            value={subprocesoActualizar.descripcion} onChange={e => {
                                                setSubprocesoActualizar(p => ({ ...p, descripcion: e.target.value }))
                                                if (erroresActualizar.descripcion) setErroresActualizar(p => ({ ...p, descripcion: undefined }));
                                            }}
                                            className={`w-full text-xs md:text-xs placeholder:text-muted-foreground/50 resize-none outline-none bg-transparent placeholder:text-xs ${erroresActualizar.descripcion ? 'placeholder:text-destructive/50' : ''}`} />
                                    </InputGroup>
                                    {erroresActualizar.descripcion && (
                                        <p className="text-xs text-destructive mt-1">{erroresActualizar.descripcion}</p>
                                    )}
                                </Field>
                            </FieldGroup>
                        </section>

                        {/** Datos de las actividades */}
                        <section className="space-y-2 mt-4">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-muted-foreground">ACTIVIDADES</p>
                                {/* <Button type="button" variant="default" size="sm" onClick={agregarActividad}>
                                    <Plus className="w-4 h-4" /> Agregar actividad
                                </Button> */}
                            </div>

                            {subprocesoActualizar.actividades.map((act, index) => (
                                <div key={index} className="border border-dashed rounded-lg p-4 space-y-4 relative">
                                    <div className="flex items-center justify-end">
                                        <Button type="button" variant="default" size="sm" onClick={() => agregarActividadEditar(index, "arriba")}>
                                            <Plus className="w-4 h-4" /> Agregar actividad antes
                                        </Button>
                                    </div>

                                    {/** Cabecera de actividad */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            ACTIVIDAD Nro. {index + 1}
                                        </span>
                                        {subprocesoActualizar.actividades.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm"
                                                className="hover:bg-destructive/10"
                                                onClick={() => eliminarActividadEditar(index)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>

                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel className="text-xs">NOMBRE ACTIVIDAD</FieldLabel>
                                            <InputGroup className={`py-5 px-2 ${erroresActualizar.actividades?.[index]?.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                                <InputGroupInput id="nombre" type="text" placeholder="Nombre de la actividad"
                                                    value={act.nombre}
                                                    onChange={e => {
                                                        actualizarActividadEditar(index, "nombre", e.target.value);
                                                        if (erroresActualizar.actividades?.[index]?.nombre) {
                                                            setErroresActualizar(prev => {
                                                                const acts = [...(prev.actividades || [])];
                                                                acts[index] = { ...acts[index], nombre: undefined };
                                                                return { ...prev, actividades: acts };
                                                            })
                                                        };
                                                    }}
                                                    className={`text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.actividades?.[index]?.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                            </InputGroup>
                                            {erroresActualizar.actividades?.[index]?.nombre && (
                                                <p className="text-xs text-destructive mt-1">{erroresActualizar.actividades?.[index]?.nombre}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">DESCRIPCIÓN ACTIVIDAD</FieldLabel>
                                            <InputGroup className={`py-5 px-2 ${erroresActualizar.actividades?.[index]?.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                                <textarea rows={3} placeholder="Descripción de la actividad"
                                                    value={act.descripcion}
                                                    onChange={e => {
                                                        actualizarActividadEditar(index, "descripcion", e.target.value)
                                                        if (erroresActualizar.actividades?.[index]?.descripcion) {
                                                            setErroresActualizar(prev => {
                                                                const acts = [...(prev.actividades || [])];
                                                                acts[index] = { ...acts[index], descripcion: undefined };
                                                                return { ...prev, actividades: acts };
                                                            })
                                                        };
                                                    }}
                                                    className={`w-full text-xs md:text-xs placeholder:text-muted-foreground/50 placeholder:text-xs resize-none outline-none bg-transparent ${erroresActualizar.actividades?.[index]?.descripcion ? 'placeholder:text-destructive/50' : ''}`} />
                                            </InputGroup>
                                            {erroresActualizar.actividades?.[index]?.descripcion && (
                                                <p className="text-xs text-destructive mt-1">{erroresActualizar.actividades?.[index]?.descripcion}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">PARTICIPANTE</FieldLabel>
                                            <Select value={act.idParticipante}
                                                onValueChange={(e) => {
                                                    actualizarActividadEditar(index, "idParticipante", e);
                                                    if (erroresActualizar.actividades?.[index]?.idParticipante) setErroresActualizar(prev => {
                                                        const acts = [...(prev.actividades || [])];
                                                        acts[index] = { ...acts[index], idParticipante: undefined };
                                                        return { ...prev, actividades: acts };
                                                    });
                                                }}>
                                                <SelectTrigger className={`w-full ${erroresActualizar.actividades?.[index]?.idParticipante ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                                    <SelectValue placeholder="Seleccione un participante" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectGroup>
                                                        {cargosDisponibles.map(cargo => (
                                                            <SelectItem key={cargo._id} value={cargo._id} className="text-xs md:text-sm">
                                                                {cargo.nombre}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {erroresActualizar.actividades?.[index]?.idParticipante && (
                                                <p className="text-xs text-destructive mt-1">{erroresActualizar.actividades[index].idParticipante}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">INSTRUMENTOS</FieldLabel>
                                            <div className="border rounded-md p-3 bg-secondary max-h-40 overflow-y-auto space-y-2">
                                                {instrumentosDisponibles.length === 0 && (
                                                    <p className="text-xs text-muted-foreground">No hay instrumentos disponibles</p>
                                                )}
                                                {obtenerInstrumentosDisponiblesEditar(index).map(inst => (
                                                    <label key={inst._id}
                                                        className="flex items-center gap-2 cursor-pointer text-xs hover:text-primary">
                                                        <input type="checkbox"
                                                            checked={act.instrumentos.includes(inst._id)}
                                                            onChange={() => toggleInstrumentoEditar(index, inst._id)}
                                                            className="accent-primary"
                                                        />
                                                        <span>{inst.nombre}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {act.instrumentos.length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {act.instrumentos.length} instrumento(s) seleccionado(s)
                                                </p>
                                            )}
                                        </Field>
                                    </FieldGroup>
                                    <div className="flex items-center justify-end">
                                        <Button type="button" variant="default" size="sm" onClick={() => agregarActividadEditar(index, "abajo")}>
                                            <Plus className="w-4 h-4" /> Agregar actividad después
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenActualizarSubproceso(false); setErroresActualizar({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Modal para mostrar las actividades de un subproceso*/}
            <Dialog open={isOpenDetalleSubproceso} onOpenChange={setIsOpenDetalleSubproceso}>
                <DialogContent className="overflow-x-auto sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-6xl" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Detalle del subproceso</DialogTitle>
                        <DialogDescription className="text-xs lg:text-sm">
                            {detalleSubproceso?.identificador}: {detalleSubproceso?.nombre}
                        </DialogDescription>
                        <div className="mt-2 no-scrollbar max-h-[50vh] overflow-y-auto">
                            <Table className="bg-white dark:bg-gray-900 rounded-lg text-xs lg:text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Nro. actividad</TableHead>
                                        <TableHead className="text-center">Nombre</TableHead>
                                        <TableHead className="text-center">Participante</TableHead>
                                        <TableHead className="text-center">Descripción</TableHead>
                                        <TableHead className="text-center">Instrumentos</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {detalleSubproceso?.actividades.map((actividad: any, i: number) => (
                                        <TableRow key={actividad._id} className="text-center">
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell className="max-w-xs whitespace-normal wrap-break-word">{actividad.nombre}</TableCell>
                                            <TableCell>{actividad.idParticipante.nombre}</TableCell>
                                            <TableCell className="max-w-sm whitespace-normal wrap-break-word">{actividad.descripcion}</TableCell>
                                            <TableCell>
                                                {actividad.instrumentos.map((instrumento: any, y: number) => (
                                                    <TooltipProvider key={y}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDescarga(instrumento)}>
                                                                    <FileDown className="text-primary" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{obtenerIdentificadorInstrumento(actividad, y) + " " + instrumento.nombre}</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}