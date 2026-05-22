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

import { GraduationCap, HousePlus, FileEdit, CircleX, ToggleLeft, ToggleRight, TextSearch } from 'lucide-react';

import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Carrera } from "@/DTOs/carrera";

import { useCarreras } from "@/hooks/use-carrera";
import { useDrawerDirection } from "@/hooks/use-drawer-size";

export default function GestionCarreras() {

    const { registrarCarrera, obtenerCarreras, actualizarEstadoCarrera, obtenerCarreraPorId, actualizarCarrera, obtenerCarrerasActivas, loading } = useCarreras();
    const drawerDirection = useDrawerDirection();

    // Listado de carreras
    const [carreras, setCarreras] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    // Total de carreras
    const [totalCarreras, setTotalCarreras] = useState(0);
    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    // Estado para el texto del input
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<{ codigo?: string, nombre?: string }>({});
    const [erroresActualizar, setErroresActualizar] = useState<{ codigo?: string, nombre?: string }>({});

    const cargarCarreras = async () => {
        try {
            const res = await obtenerCarreras(busqueda);
            const res2 = await obtenerCarrerasActivas();
            setCarreras(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalCarreras(res2.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener carreras:", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        cargarCarreras();
    }, [busqueda]);

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

    // Registro de carreras
    const [isOpenNuevaCarrera, setIsOpenNuevaCarrera] = useState(false);

    const [carrera, setCarrera] = useState<Carrera>({
        codigo: "",
        nombre: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { codigo?: string, nombre?: string } = {};
        if (!carrera.codigo.trim()) nuevosErrores.codigo = "El codigo de la carrera es requerido";
        if (!carrera.nombre.trim()) nuevosErrores.nombre = "El nombre de la carrera es requerido";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const res = await registrarCarrera(carrera);
            await cargarCarreras();
            toast.success(res.message);
            setCarrera({
                codigo: "",
                nombre: ""
            });
            setIsOpenNuevaCarrera(false);
        } catch (error: any) {
            console.error("Error al registrar carrera:", error.message);
            toast.error(error.message);
        }
    };

    // Cambio de estado de una carrera
    const handleCambioEstado = async (id: string, estado: number) => {
        try {
            const res = await actualizarEstadoCarrera(id, { estado });
            await cargarCarreras();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado de la carrera:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar carrera
    const [isOpenEditarCarrera, setIsOpenEditarCarrera] = useState(false);
    const [carreraEditar, setCarreraEditar] = useState<Carrera>({
        codigo: "",
        nombre: ""
    });
    const [carreraEditarId, setCarreraEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (carrera: any) => {
        try {
            const res = await obtenerCarreraPorId(carrera._id);
            const carreraData = res.data;
            setCarreraEditar(carreraData);
            setCarreraEditarId(carrera._id);
            setIsOpenEditarCarrera(true);
        } catch (error: any) {
            console.error("Error al obtener cargo para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { codigo?: string, nombre?: string } = {};
        if (!carreraEditar.codigo.trim()) nuevosErrores.codigo = "El codigo de la carrera es requerido";
        if (!carreraEditar.nombre.trim()) nuevosErrores.nombre = "El nombre de la carrera es requerido";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const res = await actualizarCarrera(carreraEditarId, carreraEditar);
            setIsOpenEditarCarrera(false);
            await cargarCarreras();
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
                    <h1 className="text-md md:text-xl font-bold">Gestión de carreras</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Gestione las carreras de la facultad.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevaCarrera(!isOpenNuevaCarrera)}>
                        <HousePlus /> Nueva carrera
                    </Button>
                </div>
            </div>

            {/** Listado de cargos */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <GraduationCap className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Carreras</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalCarreras}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de carreras</p>
                {/** Buscador */}
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por código o nombre..."
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
                            <TableHead className="text-center">Código</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {carreras.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No hay carreras registradas
                                </TableCell>
                            </TableRow>
                        )}
                        {carreras.map((carrera, i) => (
                            <TableRow key={carrera._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{carrera.codigo}</TableCell>
                                <TableCell>{carrera.nombre}</TableCell>
                                <TableCell>{
                                    carrera.estado ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Activo</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">Inactivo</Badge>
                                    )
                                }</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(carrera)}>
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>

                                        {carrera.estado === 1 ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleCambioEstado(carrera._id, 0)}>
                                                        <ToggleRight className="text-warning" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desactivar</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-success/60" onClick={() => handleCambioEstado(carrera._id, 1)}>
                                                        <ToggleLeft className="text-success-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Activar</TooltipContent>
                                            </Tooltip>
                                        )}

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(carrera._id, 2)}>
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

            {/** Drawer de registro de carreras */}
            <Drawer open={isOpenNuevaCarrera} onOpenChange={setIsOpenNuevaCarrera} direction={drawerDirection} onClose={() => { setCarrera({ codigo: '', nombre: '' }); setErroresRegistro({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro de carrera</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar la carrera.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="codigo" className="text-xs">CODIGO DE LA CARRERA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.codigo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="codigo" type="text" placeholder="Ingrese el codigo de la carrera"
                                        value={carrera.codigo} onChange={(e) => {
                                            setCarrera({ ...carrera, codigo: e.target.value });
                                            if (erroresRegistro.codigo) setErroresRegistro({ ...erroresRegistro, codigo: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.codigo ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.codigo && (
                                    <p className="text-destructive text-xs mt-1">{erroresRegistro.codigo}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DE LA CARRERA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre de la carrera"
                                        value={carrera.nombre} onChange={(e) => {
                                            setCarrera({ ...carrera, nombre: e.target.value });
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
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevaCarrera(false); setCarrera({ codigo: '', nombre: '' }); setErroresRegistro({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de carreras*/}
            <Drawer open={isOpenEditarCarrera} onOpenChange={setIsOpenEditarCarrera} direction={drawerDirection} onClose={() => { setIsOpenEditarCarrera(false); setErroresActualizar({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Carrera</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Ingrese la información necesaria para editar la carrera.</DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="codigo" className="text-xs">CODIGO DE LA CARRERA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.codigo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="codigo" type="text" placeholder="Ingrese el codigo de la carrera"
                                        value={carreraEditar.codigo} onChange={(e) => {
                                            setCarreraEditar({ ...carreraEditar, codigo: e.target.value });
                                            if (erroresActualizar.codigo) setErroresActualizar({ ...erroresActualizar, codigo: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.codigo ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.codigo && (
                                    <p className="text-destructive text-xs mt-1">{erroresActualizar.codigo}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DE LA CARRERA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre de la carrera"
                                        value={carreraEditar.nombre} onChange={(e) => {
                                            setCarreraEditar({ ...carreraEditar, nombre: e.target.value });
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
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarCarrera(false); setErroresActualizar({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}