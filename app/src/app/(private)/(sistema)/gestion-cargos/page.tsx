"use client";

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

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast-custom";
import { Badge } from "@/components/ui/badge";

import { BookUser, ContactRound, FileEdit, CircleX, ToggleLeft, ToggleRight, TextSearch } from 'lucide-react';

import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Cargo } from "@/DTOs/cargo";

import { useCargos } from "@/hooks/use-cargo";
import { useDrawerDirection } from "@/hooks/use-drawer-size";

export default function GestionCargos() {

    const { registrarCargo, obtenerCargos, actualizarEstadoCargo, obtenerCargoPorId, actualizarCargo, obtenerCargosActivos, loading } = useCargos();
    const drawerDirection = useDrawerDirection();

    // Listado de cargos
    const [cargos, setCargos] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    // Total de cargos
    const [totalCargos, setTotalCargos] = useState(0);
    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    // Estado para el texto del input
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<{ nombre?: string }>({});
    const [erroresActualizar, setErroresActualizar] = useState<{ nombre?: string }>({});

    const cargarCargos = async () => {
        try {
            const res = await obtenerCargos(busqueda);
            const res2 = await obtenerCargosActivos();
            setCargos(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalCargos(res2.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener cargos:", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        cargarCargos();
    }, [busqueda]);

    // Debounce -> Actualiza busqueda.palabra después de 400ms de que el usuario deje de escribir
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

    // Registro de cargos
    const [isOpenNuevoCargo, setIsOpenNuevoCargo] = useState(false);

    const [cargo, setCargo] = useState<Cargo>({
        nombre: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { nombre?: string } = {};
        if (!cargo.nombre.trim()) nuevosErrores.nombre = "El nombre del cargo es requerido";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const res = await registrarCargo(cargo);
            // Recarga la lista de cargos
            await cargarCargos();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setCargo({
                nombre: ""
            });
            setIsOpenNuevoCargo(false);

        } catch (error: any) {
            console.error("Error al registrar cargo:", error.message);
            toast.error(error.message);
        }
    };

    // Cambio de estado de un cargo
    const handleCambioEstado = async (id: string, estado: number) => {
        try {
            const res = await actualizarEstadoCargo(id, { estado });
            await cargarCargos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado del cargo:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar cargo
    const [isOpenEditarCargo, setIsOpenEditarCargo] = useState(false);
    const [cargoEditar, setCargoEditar] = useState<Cargo>({
        nombre: ""
    });
    const [cargoEditarId, setCargoEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (cargo: any) => {
        try {
            const res = await obtenerCargoPorId(cargo._id);
            const cargoData = res.data;
            setCargoEditar(cargoData);
            setCargoEditarId(cargo._id);
            setIsOpenEditarCargo(true);
        } catch (error: any) {
            console.error("Error al obtener cargo para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { nombre?: string } = {};
        if (!cargoEditar.nombre.trim()) nuevosErrores.nombre = "El nombre del cargo es requerido";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const res = await actualizarCargo(cargoEditarId, cargoEditar);
            setIsOpenEditarCargo(false);
            await cargarCargos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="container mx-auto">
            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de cargos</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Defina los cargos desempeñados por los usuarios y participantes.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoCargo(!isOpenNuevoCargo)}>
                        <ContactRound /> Nuevo cargo
                    </Button>
                </div>
            </div>

            {/** Listado de cargos */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <BookUser className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Cargos</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalCargos}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de cargos</p>
                {/** Buscador */}
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por nombre..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    {/* <TableCaption>Listado de cargos</TableCaption> */}
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {cargos.map((cargo, i) => (
                            <TableRow key={cargo._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{cargo.nombre}</TableCell>
                                <TableCell>{
                                    cargo.estado ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Activo</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">Inactivo</Badge>
                                    )
                                }</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(cargo)}>
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>

                                        {cargo.estado === 1 ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleCambioEstado(cargo._id, 0)}>
                                                        <ToggleRight className="text-warning" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desactivar</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-success/60" onClick={() => handleCambioEstado(cargo._id, 1)}>
                                                        <ToggleLeft className="text-success-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Activar</TooltipContent>
                                            </Tooltip>
                                        )}

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(cargo._id, 2)}>
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

            {/** Drawer de registro de cargos */}
            <Drawer open={isOpenNuevoCargo} onOpenChange={setIsOpenNuevoCargo} direction={drawerDirection} onClose={() => { setCargo({ nombre: '' }); setErroresRegistro({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Cargo</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar el cargo.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL CARGO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del cargo"
                                        value={cargo.nombre} onChange={(e) => {
                                            setCargo({ ...cargo, nombre: e.target.value });
                                            if (erroresRegistro.nombre) setErroresRegistro({ ...erroresRegistro, nombre: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.nombre && (
                                    <p className="text-destructive text-xs mt-1">{erroresRegistro.nombre}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevoCargo(false); setCargo({ nombre: '' }); setErroresRegistro({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de cargos*/}
            <Drawer open={isOpenEditarCargo} onOpenChange={setIsOpenEditarCargo} direction={drawerDirection} onClose={() => { setIsOpenEditarCargo(false); setErroresActualizar({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Cargo</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Ingrese la información necesaria para editar el cargo.</DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL CARGO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del cargo"
                                        value={cargoEditar.nombre} onChange={(e) => {
                                            setCargoEditar({ ...cargoEditar, nombre: e.target.value });
                                            if (erroresActualizar.nombre) setErroresActualizar({ ...erroresActualizar, nombre: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.nombre && (
                                    <p className="text-destructive text-xs mt-1">{erroresActualizar.nombre}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarCargo(false); setErroresActualizar({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}