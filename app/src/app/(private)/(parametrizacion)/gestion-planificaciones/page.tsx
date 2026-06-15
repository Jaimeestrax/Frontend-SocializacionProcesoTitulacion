"use client";

import { toast } from "@/components/ui/toast-custom";

import { CalendarPlus, CalendarRange, FileEdit, Download, Info, Plus, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronRight, TextSearch, CircleX } from 'lucide-react';

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
import { DatePickerInput } from "@/components/date-picker";

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

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FileUploadField from "@/components/ui/fileUpload";

import { useState, useEffect } from "react";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { usePlanificacion } from "@/hooks/use-planificacion";
import { useSubprocesos } from "@/hooks/use-subproceso";
import { Planificacion, SubprocesoSnapshot } from "@/DTOs/planificacion";
import { Busqueda } from "@/constants/busqueda";
import { environment } from "@/lib/api/client";

// Plantilla para generar planificación como PDF
import { PlanificacionPDF } from "@/components/planificacion-pdf";
import { pdf } from "@react-pdf/renderer";

const planificacionVacia = (): Planificacion => ({
    periodo: "",
    fechaInicio: "",
    fechaFin: "",
    subprocesos: [],
    imagenProceso: null as unknown as File,
});

type ErroresActividad = {
    fechaInicio?: string;
    fechaFin?: string;
};

type ErroresSubproceso = {
    fechaInicio?: string;
    fechaFin?: string;
    actividades?: ErroresActividad[];
};

type ErroresPlanificacion = {
    periodo?: string;
    fechaInicio?: string;
    fechaFin?: string;
    subprocesos?: ErroresSubproceso[];
    sinSubprocesos?: string;
    imagenProceso?: string;
};

export default function GestionPlanificacion() {
    // Hooks de planificacion
    const {
        registrarPlanificacion,
        obtenerPlanificaciones,
        actualizarPlanificacion,
        actualizarEstadoPlanificacion,
        obtenerPlanificacionPorId,
        contarPlanificacionesTotales,
        loading
    } = usePlanificacion();
    // Utilidad para obtener subprocesos
    const { listarSubprocesosActivos } = useSubprocesos();
    // Hook para dirección del drawer
    const drawerDirection = useDrawerDirection();

    // Listado de planificaciones
    const [planificaciones, setPlanificaciones] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    const [totalPlanificaciones, setTotalPlanificaciones] = useState(0);
    // Configuración de paginación
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [resetArchivo, setResetArchivo] = useState(false);

    const [erroresRegistro, setErroresRegistro] = useState<ErroresPlanificacion>({});
    const [erroresActualizar, setErroresActualizar] = useState<ErroresPlanificacion>({});

    // Subprocesos activos disponibles
    const [subprocesosActivos, setSubprocesosActivos] = useState<any[]>([]);

    // Registro
    const [isOpenNuevaPlanificacion, setIsOpenNuevaPlanificacion] = useState(false);
    const [planificacion, setPlanificacion] = useState<Planificacion>(planificacionVacia());

    // Actualización
    const [isOpenActualizarPlanificacion, setIsOpenActualizarPlanificacion] = useState(false);
    const [planificacionActualizar, setPlanificacionActualizar] = useState<Planificacion>(planificacionVacia());
    const [planificacionActualizarId, setPlanificacionActualizarId] = useState<string>("");

    // Detalle
    const [isOpenDetallePlanificacion, setIsOpenDetallePlanificacion] = useState(false);
    const [detallePlanificacion, setDetallePlanificacion] = useState<any>(null);
    const [expandido, setExpandido] = useState<Record<number, boolean>>({});

    // Listado de planificaciones
    const cargarPlanificaciones = async () => {
        try {
            const res = await obtenerPlanificaciones(busqueda);
            const res2 = await contarPlanificacionesTotales();
            setPlanificaciones(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalPlanificaciones(res2.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener planificaciones:", error.message);
            toast.error(error.message);
        }
    };

    // Carga de subprocesos activos
    const cargarSubprocesosActivos = async () => {
        try {
            const res = await listarSubprocesosActivos();
            setSubprocesosActivos(res.data);
        } catch (error: any) {
            console.error("Error al cargar subprocesos activos:", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => { cargarPlanificaciones(); }, [busqueda]);
    useEffect(() => { cargarSubprocesosActivos(); }, []);

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

    // Helper para agregar subproceso
    const agregarSubproceso = (spOriginal: any) => {
        // Evita duplicados
        if (planificacion.subprocesos.some(sp => sp.identificador === spOriginal.identificador)) {
            toast.warning("Este subproceso ya fue agregado");
            return;
        }

        // Crear snapshot
        const nuevoSubproceso: SubprocesoSnapshot = {
            identificador: spOriginal.identificador,
            nombre: spOriginal.nombre,
            descripcion: spOriginal.descripcion,
            fechaInicio: "",
            fechaFin: "",

            actividades: generarIdentificadoresInstrumentos(spOriginal)
        };

        setPlanificacion(prev => ({
            ...prev,
            subprocesos: [...prev.subprocesos, nuevoSubproceso]
        }));
    };

    const quitarSubproceso = (id: string) => {
        setPlanificacion(prev => ({
            ...prev,
            subprocesos: prev.subprocesos.filter(
                sp => sp.identificador !== id
            )
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores = validarPlanificacion(planificacion);
        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await registrarPlanificacion({ ...planificacion, idEncargadoGenerar: user._id });
            setPlanificacion(planificacionVacia());
            setIsOpenNuevaPlanificacion(false);
            await cargarPlanificaciones();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al registrar planificacion:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar planificación
    const handleEditar = async (plan: any) => {
        try {
            const res = await obtenerPlanificacionPorId(plan._id);
            const data = res.data;
            data.fechaInicio = data.fechaInicio.split("T")[0];
            data.fechaFin = data.fechaFin.split("T")[0];

            data.subprocesos = data.subprocesos.map((sp: any) => ({
                ...sp,
                fechaInicio: sp.fechaInicio?.split("T")[0],
                fechaFin: sp.fechaFin?.split("T")[0],

                actividades: sp.actividades.map((act: any) => ({
                    ...act,
                    fechaInicio: act.fechaInicio?.split("T")[0],
                    fechaFin: act.fechaFin?.split("T")[0],
                    nombreParticipante: act.idParticipante.nombre,
                }))
            }));
            setPlanificacionActualizar(data);
            setPlanificacionActualizarId(plan._id);
            setIsOpenActualizarPlanificacion(true);
        } catch (error: any) {
            console.error("Error al editar planificacion:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores = validarPlanificacion(planificacionActualizar);
        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await actualizarPlanificacion(planificacionActualizarId, { ...planificacionActualizar, idEncargadoActualizar: user._id });
            setPlanificacionActualizar(planificacionVacia());
            setIsOpenActualizarPlanificacion(false);
            await cargarPlanificaciones();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar planificación: ", error.message);
            toast.error(error.message);
        }
    };

    // Detalle de la planificación
    const handleDetalle = async (id: any) => {
        try {
            const res = await obtenerPlanificacionPorId(id);
            setDetallePlanificacion(res.data);
            setExpandido({});
            setIsOpenDetallePlanificacion(true);
        } catch (error: any) {
            console.error("Error al obtener detalle de planificación: ", error.message);
            toast.error(error.message);
        }
    };

    const toggleExpandido = (i: number) =>
        setExpandido(prev => ({ ...prev, [i]: !prev[i] }));

    // Cambio de estado
    const handleCambioEstado = async (id: string, estado: boolean) => {
        try {
            const res = await actualizarEstadoPlanificacion(id, { estado });
            await cargarPlanificaciones();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado:", error.message);
            toast.error(error.message);
        }
    };

    const handleDescargar = async (id: any) => {
        try {
            const res = await obtenerPlanificacionPorId(id);
            const detalle = res.data;
            // Crea el archivo PDF en memoria
            const blob = await pdf(<PlanificacionPDF detalle={detalle} />).toBlob();
            // Crea el enlace de descarga
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `planificacion-${detalle.periodo}.pdf`;
            link.click();
            // Libera la memoria
            URL.revokeObjectURL(url);
            toast.success("Planificación descargada correctamente");
        } catch (error: any) {
            console.error("Error al intentar descargar de planificación: ", error.message);
            toast.error(error.message);
        }
    };

    const formatearFecha = (fecha: any) => {
        if (!fecha) return "S/N";
        //return fecha.split("T")[0];
        return new Date(fecha).toLocaleDateString("es-EC", {
            timeZone: "UTC",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const parsearFechaLocal = (fecha: string): Date | undefined => {
        if (!fecha) return undefined;
        const solo = fecha.split("T")[0];
        const [year, month, day] = solo.split("-").map(Number);
        return new Date(year, month - 1, day); // Constructor local sin UTC
    };

    const generarIdentificadoresInstrumentos = (subproceso: any) => {
        let contadorInstrumentos = 0;

        return subproceso.actividades.map((actividad: any) => {
            const instrumentos = actividad.instrumentos.map(
                (instrumento: any, instrumentoIndex: number) => {
                    // Solo el primero incrementa
                    if (instrumentoIndex === 0) { contadorInstrumentos++; }

                    const sufijo = actividad.instrumentos.length > 1 ? `.${String.fromCharCode(97 + instrumentoIndex)}` : "";

                    return {
                        idInstrumento: typeof instrumento === "object" ? instrumento._id : instrumento,
                        identificador: `IT-${subproceso.identificador}-${contadorInstrumentos}${sufijo}`
                    };
                }
            );

            return {
                nombre: actividad.nombre,
                descripcion: actividad.descripcion,
                fechaInicio: "",
                fechaFin: "",
                idParticipante: typeof actividad.idParticipante === "object" ? actividad.idParticipante._id : actividad.idParticipante,
                nombreParticipante: actividad.idParticipante?.nombre,
                instrumentos
            };
        });
    };

    const validarPlanificacion = (plan: Planificacion): ErroresPlanificacion => {
        const e: ErroresPlanificacion = {};

        if (!plan.periodo.trim()) e.periodo = "El período de la planificación es requerido";
        if (!plan.fechaInicio) e.fechaInicio = "La fecha de inicio de la planificación es requerida";
        if (!plan.fechaFin) e.fechaFin = "La fecha de finalización es requerida";
        if (!plan.imagenProceso) e.imagenProceso = "La imagen de la planificación es requerida";
        if (plan.subprocesos.length === 0) e.sinSubprocesos = "Se debe agregar al menos un subproceso";

        const errSubs = plan.subprocesos.map(sp => {
            const eSp: ErroresSubproceso = {};
            if (!sp.fechaInicio) eSp.fechaInicio = "La fecha de inicio del subproceso es requerida";
            if (!sp.fechaFin) eSp.fechaFin = "La fecha de finalización del subproceso es requerida";

            const errActs = sp.actividades.map(act => {
                const eAct: ErroresActividad = {};
                if (!act.fechaInicio) eAct.fechaInicio = "La fecha de inicio de la actividad es requerida";
                if (!act.fechaFin) eAct.fechaFin = "La fecha de finalización de la actividad es requerida";
                return eAct;
            });

            if (errActs.some(a => Object.keys(a).length > 0)) eSp.actividades = errActs;
            return eSp;
        });

        if (errSubs.some(s => Object.keys(s).length > 0)) e.subprocesos = errSubs;

        return e;
    };

    // Para limpiar los inputs cuando ya se ha corregido el error
    const limpiarErrorSp = (errSet: Function, si: number, campo: keyof ErroresSubproceso) => {
        errSet((prev: ErroresPlanificacion) => {
            if (!prev.subprocesos?.[si]) return prev;
            const subs = [...prev.subprocesos];
            subs[si] = { ...subs[si], [campo]: undefined };
            return { ...prev, subprocesos: subs };
        });
    };

    const limpiarErrorAct = (errSet: Function, si: number, ai: number, campo: keyof ErroresActividad) => {
        errSet((prev: ErroresPlanificacion) => {
            if (!prev.subprocesos?.[si]?.actividades?.[ai]) return prev;
            const subs = [...prev.subprocesos!];
            const acts = [...subs[si].actividades!];
            acts[ai] = { ...acts[ai], [campo]: undefined };
            subs[si] = { ...subs[si], actividades: acts };
            return { ...prev, subprocesos: subs };
        });
    };

    return (
        <div className="container mx-auto">

            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de planificaciones</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Establezca la planificación vigente para los distintos periodos académicos.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevaPlanificacion(true)}>
                        <CalendarPlus /> Nueva planificación
                    </Button>
                </div>
            </div>

            {/** Listado de planificaciones */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 mb-4">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <CalendarRange className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Planificaciones</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalPlanificaciones}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>

                <p className="p-4 font-bold text-sm md:text-md">Listado de planificaciones</p>
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por periodo académico..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Periodo</TableHead>
                            <TableHead className="text-center">Fecha inicio</TableHead>
                            <TableHead className="text-center">Fecha fin</TableHead>
                            <TableHead className="text-center">Subprocesos</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="text-xs lg:text-sm">
                        {planificaciones.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                    No hay planificaciones registradas
                                </TableCell>
                            </TableRow>
                        )}
                        {planificaciones.map((plan, i) => (
                            <TableRow key={plan._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{plan.periodo}</TableCell>
                                <TableCell>{formatearFecha(plan.fechaInicio)}</TableCell>
                                <TableCell>{formatearFecha(plan.fechaFin)}</TableCell>
                                <TableCell>
                                    <Badge variant={"default"} className="px-5 py-3">{plan.subprocesos?.length || 0} subproceso(s)</Badge>
                                </TableCell>
                                <TableCell>
                                    {plan.estado
                                        ? <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Vigente</Badge>
                                        : <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">No vigente</Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleDescargar(plan._id)}>
                                                    <Download className="text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Descargar PDF</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDetalle(plan._id)}>
                                                    <Info className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Detalle</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" disabled={!plan.estado} onClick={() => handleEditar(plan)}>
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        {plan.estado ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleCambioEstado(plan._id, !plan.estado)}>
                                                        <ToggleRight className="text-warning" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desactivar</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-success/60" disabled={!plan.estado} onClick={() => handleCambioEstado(plan._id, !plan.estado)}>
                                                        <ToggleLeft className="text-success-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Activar</TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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

            {/** Drawer de regsitro */}
            <Drawer open={isOpenNuevaPlanificacion} onOpenChange={setIsOpenNuevaPlanificacion} direction={drawerDirection} onClose={() => { setPlanificacion(planificacionVacia()); setErroresRegistro({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro de planificación</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Lleve a cabo la planificación del proceso de titulación para el periodo académico.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleSubmit}>
                        {/** Información identificativa de la planificación */}
                        <section className="space-y-4">
                            <p className="font-semibold text-sm text-muted-foreground">PERIODO ACADÉMICO</p>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="periodo" className="text-xs">CODIGO PAO</FieldLabel>
                                    <InputGroup className={`py-5 px-2 ${erroresRegistro.periodo ? 'border border-destructive bg-destructive/10' : 'bg-secondary'}`}>
                                        <InputGroupInput id="periodo" type="text" placeholder="Ingrese el nombre del periodo académico"
                                            value={planificacion.periodo}
                                            onChange={e => {
                                                setPlanificacion(p => ({ ...p, periodo: e.target.value }));
                                                if (erroresRegistro.periodo) setErroresRegistro(p => ({ ...p, periodo: undefined }));
                                            }}
                                            className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.periodo ? 'placeholder:text-destructive/50' : ''}`}
                                        />
                                    </InputGroup>
                                    {erroresRegistro.periodo && (
                                        <p className="text-destructive text-xs mt-1">{erroresRegistro.periodo}</p>
                                    )}
                                </Field>
                                <div className="flex md:flex-col items-center justify-between gap-2">
                                    <DatePickerInput id="fechaInicio" label="FECHA INICIO"
                                        value={parsearFechaLocal(planificacion.fechaInicio)}
                                        onChange={(date) => {
                                            setPlanificacion(p => ({ ...p, fechaInicio: date ? date.toISOString().split("T")[0] : "" }));
                                            if (erroresRegistro.fechaInicio) setErroresRegistro(p => ({ ...p, fechaInicio: undefined }));
                                        }}
                                        error={erroresRegistro.fechaInicio}
                                        className="flex-1"
                                    />
                                    <DatePickerInput id="fechaFin" label="FECHA FIN"
                                        value={parsearFechaLocal(planificacion.fechaFin)}
                                        onChange={(date) => {
                                            setPlanificacion(p => ({ ...p, fechaFin: date ? date.toISOString().split("T")[0] : "" }));
                                            if (erroresRegistro.fechaFin) setErroresRegistro(p => ({ ...p, fechaFin: undefined }));
                                        }}
                                        error={erroresRegistro.fechaFin}
                                        className="flex-1"
                                    />
                                </div>
                                <Field>
                                    <FileUploadField id="imagenProceso" label="IMAGEN PROCESO" accept=".jpg,.png,.jpeg" reset={resetArchivo}
                                        onChange={(file) => {
                                            if (file) {
                                                const extensionesPermitidas = ["jpg", "png", "jpeg"];
                                                const extension = file.name.split(".").pop()?.toLowerCase();

                                                if (!extension || !extensionesPermitidas.includes(extension)) {
                                                    setErroresRegistro(prev => ({ ...prev, imagenProceso: "Archivo no valido." }));

                                                    setPlanificacion(prev => ({ ...prev, imagenProceso: null as unknown as File }));

                                                    setResetArchivo(true);

                                                    setTimeout(() => {
                                                        setResetArchivo(false);
                                                    }, 100);

                                                    return;
                                                }
                                            }
                                            setPlanificacion(prev => ({ ...prev, imagenProceso: file as File }));
                                            if (file && erroresRegistro.imagenProceso) setErroresRegistro(prev => ({ ...prev, imagenProceso: undefined }));
                                        }}
                                    />
                                    {erroresRegistro.imagenProceso && (
                                        <p className="text-xs text-destructive mt-1">{erroresRegistro.imagenProceso}</p>
                                    )}
                                </Field>
                            </FieldGroup>
                        </section>

                        {/** Subprocesos seleccionados con fechas */}
                        {planificacion.subprocesos.length > 0 && (
                            <section className="space-y-4 mt-4">
                                <p className="font-semibold text-sm text-muted-foreground">SUBPROCESOS SELECCIONADOS</p>
                                {planificacion.subprocesos.map((sp, si) => (
                                    <div key={sp.identificador} className="border border-dashed rounded-lg p-2 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-semibold">{si + 1}. {sp.identificador}: {sp.nombre}</span>
                                                <span className="text-xs text-muted-foreground">Descripción: {sp.descripcion}</span>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm"
                                                className="hover:bg-destructive/10" onClick={() => quitarSubproceso(sp.identificador)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                        <div className="flex md:flex-col items-center justify-between gap-2">
                                            <DatePickerInput id={`sp-inicio-${si}`} label="INICIO SUBPROCESO"
                                                value={parsearFechaLocal(sp.fechaInicio)}
                                                onChange={(date) => {
                                                    setPlanificacion(prev => {
                                                        const subprocesos = [...prev.subprocesos];
                                                        subprocesos[si] = { ...subprocesos[si], fechaInicio: date ? date.toISOString().split("T")[0] : "" };
                                                        return { ...prev, subprocesos };
                                                    });
                                                    limpiarErrorSp(setErroresRegistro, si, "fechaInicio");
                                                }}
                                                error={erroresRegistro.subprocesos?.[si]?.fechaInicio}
                                            />
                                            <DatePickerInput id={`sp-fin-${si}`} label="FIN SUBPROCESO"
                                                value={parsearFechaLocal(sp.fechaFin)}
                                                onChange={(date) => {
                                                    setPlanificacion(prev => {
                                                        const subprocesos = [...prev.subprocesos];
                                                        subprocesos[si] = { ...subprocesos[si], fechaFin: date ? date.toISOString().split("T")[0] : "" };
                                                        return { ...prev, subprocesos };
                                                    });
                                                    limpiarErrorSp(setErroresRegistro, si, "fechaFin");
                                                }}
                                                error={erroresRegistro.subprocesos?.[si]?.fechaFin}
                                            />
                                        </div>

                                        {/** Actividades */}
                                        <div className="space-y-3">
                                            <p className="text-xs font-semibold text-muted-foreground">ACTIVIDADES</p>
                                            {sp.actividades.map((act, ai) => (
                                                <div key={ai} className="border rounded-md p-3 space-y-2 bg-background/40">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-xs font-semibold">
                                                            ACTIVIDAD {ai + 1}: {act.nombre}
                                                        </span>

                                                        <span className="text-xs font-semibold flex flex-row items-center md:flex-col md:items-start gap-1">
                                                            Participante:
                                                            <Badge variant="default" className="text-xs">
                                                                {act.nombreParticipante}
                                                            </Badge>
                                                        </span>

                                                        <span className="text-xs text-muted-foreground">
                                                            Descripción: {act.descripcion}
                                                        </span>
                                                    </div>

                                                    <div className="flex md:flex-col items-center justify-between gap-2">
                                                        <DatePickerInput id={`act-inicio-${si}-${ai}`} label="INICIO ACTIVIDAD"
                                                            value={parsearFechaLocal(act.fechaInicio)}
                                                            onChange={(date) => {
                                                                setPlanificacion(prev => {
                                                                    const subprocesos = [...prev.subprocesos];
                                                                    const actividades = [...subprocesos[si].actividades];
                                                                    actividades[ai] = { ...actividades[ai], fechaInicio: date ? date.toISOString().split("T")[0] : "" };
                                                                    subprocesos[si] = { ...subprocesos[si], actividades };
                                                                    return { ...prev, subprocesos };
                                                                });
                                                                limpiarErrorAct(setErroresRegistro, si, ai, "fechaInicio");
                                                            }}
                                                            error={erroresRegistro.subprocesos?.[si]?.actividades?.[ai]?.fechaInicio}
                                                        />

                                                        <DatePickerInput id={`act-fin-${si}-${ai}`} label="FIN ACTIVIDAD"
                                                            value={parsearFechaLocal(act.fechaFin)}
                                                            onChange={(date) => {
                                                                setPlanificacion(prev => {
                                                                    const subprocesos = [...prev.subprocesos];
                                                                    const actividades = [...subprocesos[si].actividades];
                                                                    actividades[ai] = { ...actividades[ai], fechaFin: date ? date.toISOString().split("T")[0] : "" };
                                                                    subprocesos[si] = { ...subprocesos[si], actividades };
                                                                    return { ...prev, subprocesos };
                                                                });
                                                                limpiarErrorAct(setErroresRegistro, si, ai, "fechaFin");
                                                            }}
                                                            error={erroresRegistro.subprocesos?.[si]?.actividades?.[ai]?.fechaFin}
                                                        />
                                                    </div>

                                                    {act.instrumentos.length > 0 && (
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-semibold text-muted-foreground">INSTRUMENTOS</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {act.instrumentos.map((inst, ii) => (
                                                                    <Badge key={ii} variant="default" className="text-xs">
                                                                        {inst.identificador}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/** Selección de subprocesos */}
                        <section className="space-y-2 mt-4">
                            <p className="font-semibold text-sm text-muted-foreground">SUBPROCESOS DISPONIBLES</p>
                            <div className="border rounded-lg p-3 bg-secondary max-h-48 overflow-y-auto space-y-1">
                                {subprocesosActivos.length === 0 && (
                                    <p className="text-xs text-muted-foreground">No hay subprocesos activos disponibles</p>
                                )}
                                {subprocesosActivos.map(sp => {
                                    const yaAgregado = planificacion.subprocesos.some(s => s.identificador === sp.identificador);
                                    return (
                                        <div key={sp._id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-background/60">
                                            <span className="text-xs font-medium">{sp.orden}.- {sp.identificador}: {sp.nombre}</span>
                                            <Button type="button" size="sm" variant={yaAgregado ? "ghost" : "default"}
                                                disabled={yaAgregado} onClick={() => agregarSubproceso(sp)}
                                                className="h-6 text-xs px-2">
                                                <Plus className="w-3 h-3" /> {yaAgregado ? "Agregado" : "Agregar"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                            {erroresRegistro.sinSubprocesos && (
                                <p className="text-destructive text-xs mt-2">{erroresRegistro.sinSubprocesos}</p>
                            )}
                        </section>

                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6"
                                onClick={() => { setIsOpenNuevaPlanificacion(false); setErroresRegistro({}); setPlanificacion(planificacionVacia()); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de actualización */}
            <Drawer open={isOpenActualizarPlanificacion} onOpenChange={setIsOpenActualizarPlanificacion} direction={drawerDirection} onClose={() => { setIsOpenActualizarPlanificacion(false); setErroresActualizar({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Actualizar planificación</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Modifique las fechas de la planificación para el periodo académico.
                        </DrawerDescription>
                    </DrawerHeader>

                    {planificacionActualizar && (
                        <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleActualizar}>
                            {/** Información identificativa de la planificación */}
                            <section className="space-y-4">
                                <p className="font-semibold text-sm text-muted-foreground">PERIODO ACADÉMICO</p>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="periodo" className="text-xs">CODIGO PAO</FieldLabel>
                                        <InputGroup className={`py-5 px-2 ${erroresActualizar.periodo ? 'border border-destructive bg-destructive/10' : 'bg-secondary'}`}>
                                            <InputGroupInput id="periodo" type="text" placeholder="Ingrese el nombre del periodo académico" required
                                                value={planificacionActualizar.periodo} onChange={e => {
                                                    setPlanificacionActualizar(p => ({ ...p, periodo: e.target.value }));
                                                    if (erroresActualizar.periodo) setErroresActualizar(p => ({ ...p, periodo: undefined }))
                                                }}
                                                className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.periodo ? 'placeholder:text-destructive/50' : ''}`}
                                            />
                                        </InputGroup>
                                        {erroresActualizar.periodo && (
                                            <p className="text-destructive text-xs mt-1">{erroresActualizar.periodo}</p>
                                        )}
                                    </Field>
                                    <div className="flex md:flex-col items-center justify-between gap-2">
                                        <DatePickerInput id="fechaInicio" label="FECHA INICIO"
                                            value={parsearFechaLocal(planificacionActualizar.fechaInicio)}
                                            onChange={(date) => {
                                                setPlanificacionActualizar(p => ({ ...p, fechaInicio: date ? date.toISOString().split("T")[0] : "" }));
                                                if (erroresActualizar.fechaInicio) setErroresActualizar(p => ({ ...p, fechaInicio: undefined }));
                                            }}
                                            error={erroresActualizar.fechaInicio}
                                            className="flex-1"
                                        />
                                        <DatePickerInput id="fechaFin" label="FECHA FIN"
                                            value={parsearFechaLocal(planificacionActualizar.fechaFin)}
                                            onChange={(date) => {
                                                setPlanificacionActualizar(p => ({ ...p, fechaFin: date ? date.toISOString().split("T")[0] : "" }));
                                                if (erroresActualizar.fechaFin) setErroresActualizar(p => ({ ...p, fechaFin: undefined }));
                                            }}
                                            error={erroresActualizar.fechaFin}
                                            className="flex-1"
                                        />
                                    </div>
                                    <Field>
                                        {typeof planificacionActualizar.imagenProceso === 'string' && (
                                            <>
                                                <FieldLabel htmlFor="periodo" className="text-xs">IMAGEN PROCESO</FieldLabel>
                                                <div className="relative flex items-center justify-center p-3 bg-secondary rounded-md mb-2">
                                                    <img src={`${environment.baseUrl}/${planificacionActualizar.imagenProceso}`} alt="Imagen" className="object-cover w-45 h-45" />
                                                    {/* Eliminar la imagen actual */}
                                                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 hover:bg-destructive/10 h-6 w-6"
                                                        onClick={() => setPlanificacionActualizar({ ...planificacionActualizar, imagenProceso: null as unknown as File })}>
                                                        <CircleX className="text-destructive h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        {typeof planificacionActualizar.imagenProceso !== 'string' && (
                                            <FileUploadField id="imagenProceso" label="NUEVA IMAGEN PROCESO" accept=".jpg,.png,.jpeg" reset={resetArchivo}
                                                onChange={(file) => {
                                                    if (file) {
                                                        const extensionesPermitidas = ["jpg", "png", "jpeg"];
                                                        const extension = file.name.split(".").pop()?.toLowerCase();

                                                        if (!extension || !extensionesPermitidas.includes(extension)) {
                                                            setErroresActualizar(prev => ({ ...prev, imagenProceso: "Archivo no valido." }));

                                                            setPlanificacionActualizar(prev => ({ ...prev, imagenProceso: null as unknown as File }));

                                                            setResetArchivo(true);

                                                            setTimeout(() => {
                                                                setResetArchivo(false);
                                                            }, 100);

                                                            return;
                                                        }
                                                    }
                                                    setPlanificacionActualizar({ ...planificacionActualizar, imagenProceso: file as File });
                                                    if (file && erroresActualizar.imagenProceso) setErroresActualizar(prev => ({ ...prev, imagenProceso: undefined }));
                                                }}
                                            />
                                        )}
                                        {erroresActualizar.imagenProceso && (
                                            <p className="text-xs text-destructive mt-1">{erroresActualizar.imagenProceso}</p>
                                        )}
                                    </Field>
                                </FieldGroup>
                            </section>

                            {/** Subprocesos seleccionados con fechas */}
                            <section className="space-y-4 mt-4">
                                <p className="font-semibold text-sm text-muted-foreground">SUBPROCESOS SELECCIONADOS</p>
                                {planificacionActualizar.subprocesos.map((sp, si) => (
                                    <div key={sp.identificador} className="border border-dashed rounded-lg p-2 space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">{si + 1}. {sp.identificador}: {sp.nombre}</span>
                                            <span className="text-xs text-muted-foreground">Descripción: {sp.descripcion}</span>
                                        </div>
                                        <div className="flex md:flex-col items-center justify-between gap-2">
                                            <DatePickerInput id={`sp-inicio-${si}`} label="INICIO SUBPROCESO"
                                                value={parsearFechaLocal(sp.fechaInicio)}
                                                onChange={(date) => {
                                                    setPlanificacionActualizar(prev => {
                                                        const subprocesos = [...prev.subprocesos];
                                                        subprocesos[si] = { ...subprocesos[si], fechaInicio: date ? date.toISOString().split("T")[0] : "" };
                                                        return { ...prev, subprocesos };
                                                    });
                                                    limpiarErrorSp(setErroresActualizar, si, "fechaInicio");
                                                }}
                                                error={erroresActualizar.subprocesos?.[si]?.fechaInicio}
                                            />
                                            <DatePickerInput id={`sp-fin-${si}`} label="FIN SUBPROCESO"
                                                value={parsearFechaLocal(sp.fechaFin)}
                                                onChange={(date) => {
                                                    setPlanificacionActualizar(prev => {
                                                        const subprocesos = [...prev.subprocesos];
                                                        subprocesos[si] = { ...subprocesos[si], fechaFin: date ? date.toISOString().split("T")[0] : "" };
                                                        return { ...prev, subprocesos };
                                                    });
                                                    limpiarErrorSp(setErroresActualizar, si, "fechaFin");
                                                }}
                                                error={erroresActualizar.subprocesos?.[si]?.fechaFin}
                                            />
                                        </div>

                                        {/** Actividades */}
                                        <div className="space-y-3">
                                            <p className="text-xs font-semibold text-muted-foreground">ACTIVIDADES</p>
                                            {sp.actividades.map((act, ai) => (
                                                <div key={ai} className="border rounded-md p-3 space-y-2 bg-background/40">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-xs font-semibold">
                                                            ACTIVIDAD {ai + 1}: {act.nombre}
                                                        </span>

                                                        <span className="text-xs font-semibold flex flex-row items-center md:flex-col md:items-start gap-1">
                                                            Participante:
                                                            <Badge variant="default" className="text-xs">
                                                                {act.nombreParticipante}
                                                            </Badge>
                                                        </span>

                                                        <span className="text-xs text-muted-foreground">
                                                            Descripción: {act.descripcion}
                                                        </span>
                                                    </div>

                                                    <div className="flex md:flex-col items-center justify-between gap-2">
                                                        <DatePickerInput id={`act-inicio-${si}-${ai}`} label="INICIO ACTIVIDAD"
                                                            value={parsearFechaLocal(act.fechaInicio)}
                                                            onChange={(date) => {
                                                                setPlanificacionActualizar(prev => {
                                                                    const subprocesos = [...prev.subprocesos];
                                                                    const actividades = [...subprocesos[si].actividades];
                                                                    actividades[ai] = { ...actividades[ai], fechaInicio: date ? date.toISOString().split("T")[0] : "" };
                                                                    subprocesos[si] = { ...subprocesos[si], actividades };
                                                                    return { ...prev, subprocesos };
                                                                });
                                                                limpiarErrorAct(setErroresActualizar, si, ai, "fechaInicio");
                                                            }}
                                                            error={erroresActualizar.subprocesos?.[si]?.actividades?.[ai]?.fechaInicio}
                                                        />

                                                        <DatePickerInput id={`act-fin-${si}-${ai}`} label="FIN ACTIVIDAD"
                                                            value={parsearFechaLocal(act.fechaFin)}
                                                            onChange={(date) => {
                                                                setPlanificacionActualizar(prev => {
                                                                    const subprocesos = [...prev.subprocesos];
                                                                    const actividades = [...subprocesos[si].actividades];
                                                                    actividades[ai] = { ...actividades[ai], fechaFin: date ? date.toISOString().split("T")[0] : "" };
                                                                    subprocesos[si] = { ...subprocesos[si], actividades };
                                                                    return { ...prev, subprocesos };
                                                                });
                                                                limpiarErrorAct(setErroresActualizar, si, ai, "fechaFin");
                                                            }}
                                                            error={erroresActualizar.subprocesos?.[si]?.actividades?.[ai]?.fechaFin}
                                                        />
                                                    </div>

                                                    {act.instrumentos.length > 0 && (
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-semibold text-muted-foreground">INSTRUMENTOS</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {act.instrumentos.map((inst, ii) => (
                                                                    <Badge key={ii} variant="default" className="text-xs">
                                                                        {inst.identificador}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>

                            <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-4">
                                <Button type="submit" className="md:py-6" disabled={loading}>
                                    {loading ? "Actualizando..." : "Actualizar"}
                                </Button>
                                <Button type="button" variant="outline" className="md:py-6"
                                    onClick={() => { setIsOpenActualizarPlanificacion(false); setErroresActualizar({}); }}>
                                    Cancelar
                                </Button>
                            </DrawerFooter>
                        </form>
                    )}
                </DrawerContent>
            </Drawer>

            {/** Modal para mostrar el detalle de la planificación */}
            <Dialog open={isOpenDetallePlanificacion} onOpenChange={setIsOpenDetallePlanificacion}>
                <DialogContent className="overflow-x-auto sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-6xl">
                    <DialogHeader>
                        <DialogTitle>Detalle de planificación</DialogTitle>
                        <DialogDescription className="text-xs md:text-sm">
                            Planificacion para el periodo academico: {detallePlanificacion?.periodo}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 no-scrollbar max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                            <div>
                                <p className="text-xs text-muted-foreground">FECHA INICIO PERIODO</p>
                                <p className="text-sm font-semibold">{formatearFecha(detallePlanificacion?.fechaInicio)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">FECHA FIN PERIODO</p>
                                <p className="text-sm font-semibold">{formatearFecha(detallePlanificacion?.fechaFin)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">ESTADO</p>
                                {detallePlanificacion?.estado
                                    ? <Badge className="bg-success text-foreground">Vigente</Badge>
                                    : <Badge className="bg-destructive text-foreground">No vigente</Badge>
                                }
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Nro. SUBPROCESOS</p>
                                <p className="text-sm font-semibold">{detallePlanificacion?.subprocesos?.length || 0}</p>
                            </div>
                        </div>

                        {detallePlanificacion?.subprocesos?.map((sp: any, si: number) => (
                            <div key={si} className="border rounded-lg overflow-hidden mt-2">
                                <Button variant={"link"} type="button" className="w-full h-auto flex items-center justify-between p-6"
                                    onClick={() => toggleExpandido(si)}>
                                    <div>
                                        <span className="text-xs text-left font-semibold whitespace-normal">{si + 1}.- {sp.identificador}: {sp.nombre}</span>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-xs text-muted-foreground">Fecha de inicio: {formatearFecha(sp.fechaInicio)}</span>
                                            <span className="text-xs text-muted-foreground">Fecha de fin: {formatearFecha(sp.fechaFin)}</span>
                                        </div>
                                    </div>
                                    {expandido[si] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </Button>

                                {expandido[si] && (
                                    <div className="p-4 space-y-3">
                                        <p className="text-xs text-muted-foreground">{sp.descripcion}</p>
                                        {sp.actividades?.map((act: any, ai: number) => (
                                            <div key={ai} className="border rounded-md p-3 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs font-semibold">Actividad {ai + 1}: {act.nombre}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{act.descripcion}</p>
                                                    </div>
                                                    {act.idParticipante?.nombre && (
                                                        <Badge variant="default" className="text-xs shrink-0 ml-2">
                                                            {act.idParticipante.nombre}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-4">
                                                    <span className="text-xs text-muted-foreground">Inicio: {formatearFecha(act.fechaInicio)}</span>
                                                    <span className="text-xs text-muted-foreground">Fin: {formatearFecha(act.fechaFin)}</span>
                                                </div>
                                                {act.instrumentos?.length > 0 && (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-semibold text-muted-foreground">INSTRUMENTOS</p>
                                                        {act.instrumentos.map((inst: any, ii: number) => (
                                                            <div key={ii} className="flex items-center gap-2 text-xs">
                                                                <Badge variant="outline" className="font-mono text-xs">
                                                                    {inst.identificador}
                                                                </Badge>
                                                                <span>{inst.idInstrumento?.nombre}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
