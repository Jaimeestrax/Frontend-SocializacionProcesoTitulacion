"use client";

import { toast } from "@/components/ui/toast-custom";
import { GitBranchPlus, GitFork, FileEdit, CircleX, Plus, Trash2 } from 'lucide-react';
import {
    Drawer, DrawerContent, DrawerDescription,
    DrawerFooter, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { useSubprocesos } from "@/hooks/use-subproceso";
import { useInstrumentos } from "@/hooks/use-instrumento";
import { useCargos } from "@/hooks/use-cargo";
import { Busqueda } from "@/interfaces/busqueda";
import { Subproceso } from "@/DTOs/subproceso";
import { Actividad } from "@/DTOs/actividad";


const actividadVacia = (): Actividad => ({
    nombre: "",
    descripcion: "",
    id_cargo: "",
    fecha_inicio: "",
    fecha_fin: "",
    instrumentos: [],
});

const subprocesoVacio = (): Subproceso => ({
    identificador: "",
    nombre: "",
    descripcion: "",
    actividades: [actividadVacia()],
});

export default function GestionSubprocesos() {
    // Hooks de subproceso
    const { registrarSubproceso, obtenerSubprocesos, actualizarEstadoSubproceso, actualizarSubproceso, obtenerSubprocesoPorId, loading } = useSubprocesos();
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
            setSubprocesos(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalSubprocesos(res.data.totalDocs);
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
    const agregarActividad = () =>
        setSubproceso((prev: any) => ({ ...prev, actividades: [...prev.actividades, actividadVacia()] }));

    const agregarActividadEditar = () =>
        setSubprocesoActualizar((prev: any) => ({ ...prev, actividades: [...prev.actividades, actividadVacia()] }));

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
        try {
            const res = await registrarSubproceso(subproceso);
            setSubproceso(subprocesoVacio());
            setIsOpenNuevoSubproceso(false);
            await cargarSubprocesos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al registrar subproceso: ", error.message);
            toast.error(error.message);
        }
    };

    const handleCambioEstado = async (id: string, estado: boolean) => {
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
        try {
            const res = await actualizarSubproceso(subprocesoActualizarId, subprocesoActualizar);
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
                fecha_inicio: act.fecha_inicio
                    ? new Date(act.fecha_inicio).toISOString().split("T")[0]
                    : "",
                fecha_fin: act.fecha_fin
                    ? new Date(act.fecha_fin).toISOString().split("T")[0]
                    : "",
                id_cargo: act.id_cargo?._id || "",
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
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Identificador</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Fecha inicio</TableHead>
                            <TableHead className="text-center">Fecha fin</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subprocesos.map((sp, i) => (
                            <TableRow key={sp._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{sp.identificador}</TableCell>
                                <TableCell>{sp.nombre}</TableCell>
                                <TableCell>{new Date(sp.fecha_inicio).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(sp.fecha_fin).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {sp.estado
                                        ? <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground text-xs md:text-sm">Activo</Badge>
                                        : <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground text-xs md:text-sm">Inactivo</Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(sp)} >
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(sp._id, !sp.estado)}>
                                                    <CircleX className="text-destructive" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{sp.estado ? "Desactivar" : "Activar"}</TooltipContent>
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

            {/** Drawer de registro */}
            <Drawer open={isOpenNuevoSubproceso} onOpenChange={setIsOpenNuevoSubproceso} direction={drawerDirection} onClose={() => setSubproceso(subprocesoVacio())}>
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
                                <Field>
                                    <FieldLabel htmlFor="identificador" className="text-xs">ID SUBPROCESO</FieldLabel>
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <InputGroupInput id="identificador" type="text" placeholder="OM" required
                                            value={subproceso.identificador} onChange={e => setSubproceso(p => ({ ...p, identificador: e.target.value }))}
                                            className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE</FieldLabel>
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del subproceso" required
                                            value={subproceso.nombre} onChange={e => setSubproceso(p => ({ ...p, nombre: e.target.value }))}
                                            className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCIÓN</FieldLabel>
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <textarea id="descripcion" rows={3} placeholder="Ingrese la descripción del subproceso"
                                            value={subproceso.descripcion} onChange={e => setSubproceso(p => ({ ...p, descripcion: e.target.value }))}
                                            className="w-full text-sm md:text-sm placeholder:text-muted-foreground/50 resize-none outline-none bg-transparent placeholder:text-sm" />
                                    </InputGroup>
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

                                    {/** Cabecera de actividad */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            ACTIVIDAD {index + 1}
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
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <InputGroupInput type="text" placeholder="Nombre de la actividad" required
                                                    value={act.nombre}
                                                    onChange={e => actualizarActividad(index, "nombre", e.target.value)}
                                                    className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                            </InputGroup>
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">DESCRIPCIÓN ACTIVIDAD</FieldLabel>
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <textarea rows={2} placeholder="Descripción de la actividad"
                                                    value={act.descripcion}
                                                    onChange={e => actualizarActividad(index, "descripcion", e.target.value)}
                                                    className="w-full text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none bg-transparent" />
                                            </InputGroup>
                                        </Field>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Field>
                                                <FieldLabel className="text-xs">FECHA INICIO</FieldLabel>
                                                <InputGroup className="py-5 px-1 bg-secondary">
                                                    <InputGroupInput type="date" required
                                                        value={act.fecha_inicio}
                                                        onChange={e => actualizarActividad(index, "fecha_inicio", e.target.value)}
                                                        className="text-xs md:text-xs" />
                                                </InputGroup>
                                            </Field>
                                            <Field>
                                                <FieldLabel className="text-xs">FECHA FIN</FieldLabel>
                                                <InputGroup className="py-5 px-1 bg-secondary">
                                                    <InputGroupInput type="date" required
                                                        value={act.fecha_fin}
                                                        onChange={e => actualizarActividad(index, "fecha_fin", e.target.value)}
                                                        className="text-xs md:text-xs" />
                                                </InputGroup>
                                            </Field>
                                        </div>

                                        <Field>
                                            <FieldLabel className="text-xs">PARTICIPANTE</FieldLabel>
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <select
                                                    value={act.id_cargo}
                                                    onChange={e => actualizarActividad(index, "id_cargo", e.target.value)}
                                                    className="w-full text-sm bg-transparent outline-none py-2">
                                                    <option value="">Seleccione un cargo</option>
                                                    {cargosDisponibles.map(cargo => (
                                                        <option key={cargo._id} value={cargo._id}>
                                                            {cargo.nombre_cargo}
                                                        </option>
                                                    ))}
                                                </select>
                                            </InputGroup>
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">INSTRUMENTOS</FieldLabel>
                                            <div className="border rounded-md p-3 bg-secondary max-h-40 overflow-y-auto space-y-2">
                                                {instrumentosDisponibles.length === 0 && (
                                                    <p className="text-xs text-muted-foreground">No hay instrumentos disponibles</p>
                                                )}
                                                {instrumentosDisponibles.map(inst => (
                                                    <label key={inst._id}
                                                        className="flex items-center gap-2 cursor-pointer text-xs hover:text-primary">
                                                        <input
                                                            type="checkbox"
                                                            checked={act.instrumentos.includes(inst._id)}
                                                            onChange={() => toggleInstrumento(index, inst._id)}
                                                            className="accent-primary"
                                                        />
                                                        <span>{inst.identificador} — {inst.nombre}</span>
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

                                    <div className="flex items-center justify-between">
                                        <p></p>
                                        <Button type="button" variant="default" size="sm" onClick={agregarActividad}>
                                            <Plus className="w-4 h-4" /> Agregar actividad
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => setIsOpenNuevoSubproceso(false)}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de actualización */}
            <Drawer open={isOpenActualizarSubproceso} onOpenChange={setIsOpenActualizarSubproceso} direction={drawerDirection} onClose={() => setSubprocesoActualizar(subprocesoVacio())}>
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
                                <Field>
                                    <FieldLabel htmlFor="identificador" className="text-xs">ID SUBPROCESO</FieldLabel>
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <InputGroupInput id="identificador" type="text" placeholder="OM" required
                                            value={subprocesoActualizar.identificador} onChange={e => setSubprocesoActualizar(p => ({ ...p, identificador: e.target.value }))}
                                            className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE</FieldLabel>
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del subproceso" required
                                            value={subprocesoActualizar.nombre} onChange={e => setSubprocesoActualizar(p => ({ ...p, nombre: e.target.value }))}
                                            className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCIÓN</FieldLabel>
                                    <InputGroup className="py-5 px-2 bg-secondary">
                                        <textarea id="descripcion" rows={3} placeholder="Ingrese la descripción del subproceso"
                                            value={subprocesoActualizar.descripcion} onChange={e => setSubprocesoActualizar(p => ({ ...p, descripcion: e.target.value }))}
                                            className="w-full text-sm md:text-sm placeholder:text-muted-foreground/50 resize-none outline-none bg-transparent placeholder:text-sm" />
                                    </InputGroup>
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

                                    {/** Cabecera de actividad */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground">
                                            ACTIVIDAD {index + 1}
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
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <InputGroupInput type="text" placeholder="Nombre de la actividad" required
                                                    value={act.nombre}
                                                    onChange={e => actualizarActividadEditar(index, "nombre", e.target.value)}
                                                    className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                            </InputGroup>
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">DESCRIPCIÓN ACTIVIDAD</FieldLabel>
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <textarea rows={2} placeholder="Descripción de la actividad"
                                                    value={act.descripcion}
                                                    onChange={e => actualizarActividadEditar(index, "descripcion", e.target.value)}
                                                    className="w-full text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none bg-transparent" />
                                            </InputGroup>
                                        </Field>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Field>
                                                <FieldLabel className="text-xs">FECHA INICIO</FieldLabel>
                                                <InputGroup className="py-5 px-1 bg-secondary">
                                                    <InputGroupInput type="date" required
                                                        value={act.fecha_inicio}
                                                        onChange={e => actualizarActividadEditar(index, "fecha_inicio", e.target.value)}
                                                        className="text-xs md:text-xs" />
                                                </InputGroup>
                                            </Field>
                                            <Field>
                                                <FieldLabel className="text-xs">FECHA FIN</FieldLabel>
                                                <InputGroup className="py-5 px-1 bg-secondary">
                                                    <InputGroupInput type="date" required
                                                        value={act.fecha_fin}
                                                        onChange={e => actualizarActividadEditar(index, "fecha_fin", e.target.value)}
                                                        className="text-xs md:text-xs" />
                                                </InputGroup>
                                            </Field>
                                        </div>

                                        <Field>
                                            <FieldLabel className="text-xs">PARTICIPANTE</FieldLabel>
                                            <InputGroup className="py-5 px-2 bg-secondary">
                                                <select
                                                    value={act.id_cargo}
                                                    onChange={e => actualizarActividadEditar(index, "id_cargo", e.target.value)}
                                                    className="w-full text-sm bg-transparent outline-none py-2">
                                                    <option value="">Seleccione un cargo</option>
                                                    {cargosDisponibles.map(cargo => (
                                                        <option key={cargo._id} value={cargo._id}>
                                                            {cargo.nombre_cargo}
                                                        </option>
                                                    ))}
                                                </select>
                                            </InputGroup>
                                        </Field>

                                        <Field>
                                            <FieldLabel className="text-xs">INSTRUMENTOS</FieldLabel>
                                            <div className="border rounded-md p-3 bg-secondary max-h-40 overflow-y-auto space-y-2">
                                                {instrumentosDisponibles.length === 0 && (
                                                    <p className="text-xs text-muted-foreground">No hay instrumentos disponibles</p>
                                                )}
                                                {instrumentosDisponibles.map(inst => (
                                                    <label key={inst._id}
                                                        className="flex items-center gap-2 cursor-pointer text-xs hover:text-primary">
                                                        <input
                                                            type="checkbox"
                                                            checked={act.instrumentos.includes(inst._id)}
                                                            onChange={() => toggleInstrumentoEditar(index, inst._id)}
                                                            className="accent-primary"
                                                        />
                                                        <span>{inst.identificador} — {inst.nombre}</span>
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

                                    <div className="flex items-center justify-between">
                                        <p></p>
                                        <Button type="button" variant="default" size="sm" onClick={agregarActividadEditar}>
                                            <Plus className="w-4 h-4" /> Agregar actividad
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => setIsOpenActualizarSubproceso(false)}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}