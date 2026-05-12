"use client";

import { toast } from "@/components/ui/toast-custom";

import { CalendarPlus, CalendarRange, FileEdit, CircleX, Info, Plus, Trash2, ToggleLeft, ToggleRight, ChevronDown, ChevronRight } from 'lucide-react';

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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

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
import { useState, useEffect } from "react";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { usePlanificacion } from "@/hooks/use-planificacion";
import { useSubprocesos } from "@/hooks/use-subproceso";
import { Planificacion, SubprocesoSnapshot } from "@/DTOs/planificacion";
import { Busqueda } from "@/constants/busqueda";

const planificacionVacia = (): Planificacion => ({
    periodo: "",
    fechaInicio: "",
    fechaFin: "",
    subprocesos: []
});

export default function GestionPlanificacion() {
    // Hooks de planificacion
    const { registrarPlanificacion, obtenerPlanificaciones, actualizarPlanificacion, actualizarEstadoPlanificacion, obtenerPlanificacionPorId, loading } = usePlanificacion();
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
            setPlanificaciones(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalPlanificaciones(res.data.totalDocs);
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
    const handleDetalle = async (plan: any) => {
        try {
            const res = await obtenerPlanificacionPorId(plan._id);
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
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    <TableHeader>
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
                                    <Badge variant={"default"} className="px-5 py-3 text-xs md:text-sm">{plan.subprocesos?.length || 0} subproceso(s)</Badge>
                                </TableCell>
                                <TableCell>
                                    {plan.estado
                                        ? <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground text-xs md:text-sm">Vigente</Badge>
                                        : <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground text-xs md:text-sm">No vigente</Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDetalle(plan)}>
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
                            <PaginationLink href="#">{busqueda.pagina}</PaginationLink>
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
            <Drawer open={isOpenNuevaPlanificacion} onOpenChange={setIsOpenNuevaPlanificacion} direction={drawerDirection} onClose={() => setPlanificacion(planificacionVacia())}>
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
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <InputGroupInput id="periodo" type="text" placeholder="Ingrese el nombre del periodo académico" required
                                            value={planificacion.periodo} onChange={e => setPlanificacion(p => ({ ...p, periodo: e.target.value }))}
                                            className="text-sm md:text-sm"
                                        />
                                    </InputGroup>
                                </Field>
                                <div className="flex items-center justify-between gap-2">
                                    <Field>
                                        <FieldLabel htmlFor="fechaInicio" className="text-xs">FECHA INICIO</FieldLabel>
                                        <InputGroup className="py-5 px-2 bg-secondary">
                                            <InputGroupInput id="fechaInicio" type="date" required value={planificacion.fechaInicio}
                                                onChange={e => setPlanificacion(p => ({ ...p, fechaInicio: e.target.value }))}
                                                className="text-sm md:text-sm" />
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <FieldLabel className="text-xs">FECHA FIN</FieldLabel>
                                        <InputGroup className="py-5 px-2 bg-secondary">
                                            <InputGroupInput id="fechaFin" type="date" required value={planificacion.fechaFin}
                                                onChange={e => setPlanificacion(p => ({ ...p, fechaFin: e.target.value }))}
                                                className="text-sm md:text-sm" />
                                        </InputGroup>
                                    </Field>
                                </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel className="text-xs">INICIO SUBPROCESO</FieldLabel>
                                                <InputGroup className="py-5 px-2 bg-secondary">
                                                    <InputGroupInput type="date" required value={sp.fechaInicio}
                                                        onChange={(e) => {
                                                            setPlanificacion(prev => {
                                                                const subprocesos = [...prev.subprocesos];

                                                                subprocesos[si] = {
                                                                    ...subprocesos[si],
                                                                    fechaInicio: e.target.value
                                                                };

                                                                return {
                                                                    ...prev,
                                                                    subprocesos
                                                                };
                                                            });
                                                        }}
                                                        className="text-xs md:text-xs"
                                                    />
                                                </InputGroup>
                                            </Field>
                                            <Field>
                                                <FieldLabel className="text-xs">FIN SUBPROCESO</FieldLabel>
                                                <InputGroup className="py-5 px-2 bg-secondary">
                                                    <InputGroupInput type="date" required value={sp.fechaFin}
                                                        onChange={(e) => {
                                                            setPlanificacion(prev => {
                                                                const subprocesos = [...prev.subprocesos];

                                                                subprocesos[si] = {
                                                                    ...subprocesos[si],
                                                                    fechaFin: e.target.value
                                                                };

                                                                return {
                                                                    ...prev,
                                                                    subprocesos
                                                                };
                                                            });
                                                        }}
                                                        className="text-xs md:text-xs" />
                                                </InputGroup>
                                            </Field>
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

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        <Field>
                                                            <FieldLabel className="text-xs">INICIO ACTIVIDAD</FieldLabel>
                                                            <InputGroup className="bg-secondary">
                                                                <InputGroupInput type="date" required value={act.fechaInicio}
                                                                    onChange={(e) => {
                                                                        setPlanificacion(prev => {
                                                                            const subprocesos = [...prev.subprocesos];
                                                                            const actividades = [...subprocesos[si].actividades];

                                                                            actividades[ai] = {
                                                                                ...actividades[ai],
                                                                                fechaInicio: e.target.value
                                                                            };

                                                                            subprocesos[si] = {
                                                                                ...subprocesos[si],
                                                                                actividades
                                                                            };

                                                                            return {
                                                                                ...prev,
                                                                                subprocesos
                                                                            };
                                                                        });
                                                                    }}
                                                                    className="text-xs md:text-xs"
                                                                />
                                                            </InputGroup>
                                                        </Field>

                                                        <Field>
                                                            <FieldLabel className="text-xs">FIN ACTIVIDAD</FieldLabel>
                                                            <InputGroup className="bg-secondary">
                                                                <InputGroupInput type="date" required value={act.fechaFin}
                                                                    onChange={(e) => {
                                                                        setPlanificacion(prev => {
                                                                            const subprocesos = [...prev.subprocesos];
                                                                            const actividades = [...subprocesos[si].actividades];

                                                                            actividades[ai] = {
                                                                                ...actividades[ai],
                                                                                fechaFin: e.target.value
                                                                            };

                                                                            subprocesos[si] = {
                                                                                ...subprocesos[si],
                                                                                actividades
                                                                            };

                                                                            return {
                                                                                ...prev,
                                                                                subprocesos
                                                                            };
                                                                        });
                                                                    }}
                                                                    className="text-xs md:text-xs"
                                                                />
                                                            </InputGroup>
                                                        </Field>
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
                        </section>

                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => setIsOpenNuevaPlanificacion(false)}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de actualización */}
            <Drawer open={isOpenActualizarPlanificacion} onOpenChange={setIsOpenActualizarPlanificacion} direction={drawerDirection}>
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
                                        <InputGroup className="py-5 px-2 bg-secondary">
                                            <InputGroupInput id="periodo" type="text" placeholder="Ingrese el nombre del periodo académico" required
                                                value={planificacionActualizar.periodo} onChange={e => setPlanificacionActualizar(p => ({ ...p, periodo: e.target.value }))}
                                                className="text-sm md:text-sm"
                                            />
                                        </InputGroup>
                                    </Field>
                                    <div className="flex items-center justify-between gap-2">
                                        <Field>
                                            <FieldLabel htmlFor="fechaInicio" className="text-xs">FECHA INICIO</FieldLabel>
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <InputGroupInput id="fechaInicio" type="date" required value={planificacionActualizar.fechaInicio}
                                                    onChange={e => setPlanificacionActualizar(p => ({ ...p, fechaInicio: e.target.value }))}
                                                    className="text-sm md:text-sm" />
                                            </InputGroup>
                                        </Field>
                                        <Field>
                                            <FieldLabel className="text-xs">FECHA FIN</FieldLabel>
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <InputGroupInput id="fechaFin" type="date" required value={planificacionActualizar.fechaFin}
                                                    onChange={e => setPlanificacionActualizar(p => ({ ...p, fechaFin: e.target.value }))}
                                                    className="text-sm md:text-sm" />
                                            </InputGroup>
                                        </Field>
                                    </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Field>
                                                <FieldLabel className="text-xs">INICIO SUBPROCESO</FieldLabel>
                                                <InputGroup className="py-5 px-2 bg-secondary">
                                                    <InputGroupInput type="date" required value={sp.fechaInicio}
                                                        onChange={(e) => {
                                                            setPlanificacionActualizar(prev => {
                                                                const subprocesos = [...prev.subprocesos];

                                                                subprocesos[si] = {
                                                                    ...subprocesos[si],
                                                                    fechaInicio: e.target.value
                                                                };

                                                                return {
                                                                    ...prev,
                                                                    subprocesos
                                                                };
                                                            });
                                                        }}
                                                        className="text-xs md:text-xs"
                                                    />
                                                </InputGroup>
                                            </Field>
                                            <Field>
                                                <FieldLabel className="text-xs">FIN SUBPROCESO</FieldLabel>
                                                <InputGroup className="py-5 px-2 bg-secondary">
                                                    <InputGroupInput type="date" required value={sp.fechaFin}
                                                        onChange={(e) => {
                                                            setPlanificacionActualizar(prev => {
                                                                const subprocesos = [...prev.subprocesos];

                                                                subprocesos[si] = {
                                                                    ...subprocesos[si],
                                                                    fechaFin: e.target.value
                                                                };

                                                                return {
                                                                    ...prev,
                                                                    subprocesos
                                                                };
                                                            });
                                                        }}
                                                        className="text-xs md:text-xs" />
                                                </InputGroup>
                                            </Field>
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

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        <Field>
                                                            <FieldLabel className="text-xs">INICIO ACTIVIDAD</FieldLabel>
                                                            <InputGroup className="bg-secondary">
                                                                <InputGroupInput type="date" required value={act.fechaInicio}
                                                                    onChange={(e) => {
                                                                        setPlanificacionActualizar(prev => {
                                                                            const subprocesos = [...prev.subprocesos];
                                                                            const actividades = [...subprocesos[si].actividades];

                                                                            actividades[ai] = {
                                                                                ...actividades[ai],
                                                                                fechaInicio: e.target.value
                                                                            };

                                                                            subprocesos[si] = {
                                                                                ...subprocesos[si],
                                                                                actividades
                                                                            };

                                                                            return {
                                                                                ...prev,
                                                                                subprocesos
                                                                            };
                                                                        });
                                                                    }}
                                                                    className="text-xs md:text-xs"
                                                                />
                                                            </InputGroup>
                                                        </Field>

                                                        <Field>
                                                            <FieldLabel className="text-xs">FIN ACTIVIDAD</FieldLabel>
                                                            <InputGroup className="bg-secondary">
                                                                <InputGroupInput type="date" required value={act.fechaFin}
                                                                    onChange={(e) => {
                                                                        setPlanificacionActualizar(prev => {
                                                                            const subprocesos = [...prev.subprocesos];
                                                                            const actividades = [...subprocesos[si].actividades];

                                                                            actividades[ai] = {
                                                                                ...actividades[ai],
                                                                                fechaFin: e.target.value
                                                                            };

                                                                            subprocesos[si] = {
                                                                                ...subprocesos[si],
                                                                                actividades
                                                                            };

                                                                            return {
                                                                                ...prev,
                                                                                subprocesos
                                                                            };
                                                                        });
                                                                    }}
                                                                    className="text-xs md:text-xs"
                                                                />
                                                            </InputGroup>
                                                        </Field>
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
                                <Button type="button" variant="outline" className="md:py-6" onClick={() => setIsOpenActualizarPlanificacion(false)}>
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

