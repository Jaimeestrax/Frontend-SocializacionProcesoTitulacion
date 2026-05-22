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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast-custom";
import { Badge } from "@/components/ui/badge";

import { ShieldCogCorner, ShieldUser, FileEdit, CircleX, ToggleLeft, ToggleRight } from 'lucide-react';

import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Rol } from "@/DTOs/rol";

import { useRoles } from "@/hooks/use-rol";
import { useDrawerDirection } from "@/hooks/use-drawer-size";

export default function GestionRoles() {

    const { registrarRol, obtenerRoles, actualizarEstadoRol, obtenerRolPorId, actualizarRol, contarRolesActivos, loading } = useRoles();
    const drawerDirection = useDrawerDirection();

    // Listado de roles
    const [roles, setRoles] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    // Total de roles
    const [totalRoles, setTotalRoles] = useState(0);
    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    const [erroresRegistro, setErroresRegistro] = useState<{ nombre?: string }>({});
    const [erroresActualizar, setErroresActualizar] = useState<{ nombre?: string }>({});

    const cargarRoles = async () => {
        try {
            const res = await obtenerRoles(busqueda);
            const res2 = await contarRolesActivos();
            setRoles(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalRoles(res2.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener roles:", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        cargarRoles();
    }, [busqueda]);

    // Registro de roles
    const [isOpenNuevoRol, setIsOpenNuevoRol] = useState(false);

    const [rol, setRol] = useState<Rol>({
        nombre: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { nombre?: string } = {};
        if (!rol.nombre.trim()) nuevosErrores.nombre = "El nombre del rol es requerido";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const res = await registrarRol(rol);
            // Recarga la lista de instrumentos
            await cargarRoles();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setRol({
                nombre: ""
            });
            setIsOpenNuevoRol(false);

        } catch (error: any) {
            console.error("Error al registrar rol:", error.message);
            toast.error(error.message);
        }
    };

    // Cambio de estado de un rol
    const handleCambioEstado = async (id: string, estado: number) => {
        try {
            const res = await actualizarEstadoRol(id, { estado });
            await cargarRoles();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado del rol:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar rol
    const [isOpenEditarRol, setIsOpenEditarRol] = useState(false);
    const [rolEditar, setRolEditar] = useState<Rol>({
        nombre: ""
    });
    const [rolEditarId, setRolEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (rol: any) => {
        try {
            const res = await obtenerRolPorId(rol._id);
            const rolData = res.data;
            setRolEditar(rolData);
            setRolEditarId(rol._id);
            setIsOpenEditarRol(true);
        } catch (error: any) {
            console.error("Error al obtener rol para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { nombre?: string } = {};
        if (!rolEditar.nombre.trim()) nuevosErrores.nombre = "El nombre del rol es requerido";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const res = await actualizarRol(rolEditarId, rolEditar);
            setIsOpenEditarRol(false);
            await cargarRoles();
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
                    <h1 className="text-md md:text-xl font-bold">Gestión de roles del sistema</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Defina los roles a tomar por los usuarios del sistema.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoRol(!isOpenNuevoRol)}>
                        <ShieldCogCorner /> Nuevo rol
                    </Button>
                </div>
            </div>

            {/** Listado de roles */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <ShieldUser className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Roles</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalRoles}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de roles</p>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    {/* <TableCaption>Listado de roles</TableCaption> */}
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {roles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                    No hay roles registrados
                                </TableCell>
                            </TableRow>
                        )}
                        {roles.map((rol, i) => (
                            <TableRow key={rol._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{rol.nombre}</TableCell>
                                <TableCell>{
                                    rol.estado === 1 ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Activo</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">Inactivo</Badge>
                                    )
                                }</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(rol)}>
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>

                                        {rol.estado === 1 ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleCambioEstado(rol._id, 0)}>
                                                        <ToggleRight className="text-warning" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desactivar</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-success/60" onClick={() => handleCambioEstado(rol._id, 1)}>
                                                        <ToggleLeft className="text-success-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Activar</TooltipContent>
                                            </Tooltip>
                                        )}

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(rol._id, 2)}>
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

            {/** Drawer de registro de roles */}
            <Drawer open={isOpenNuevoRol} onOpenChange={setIsOpenNuevoRol} direction={drawerDirection} onClose={() => { setRol({ nombre: '' }); setErroresRegistro({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Rol</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar el rol.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL ROL</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del rol"
                                        value={rol.nombre} onChange={(e) => {
                                            setRol({ ...rol, nombre: e.target.value });
                                            // Limpia el error al escribir
                                            if (erroresRegistro.nombre) setErroresRegistro({ ...erroresRegistro, nombre: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {/* Mensaje de error debajo del input */}
                                {erroresRegistro.nombre && (
                                    <p className="text-destructive text-xs mt-1">{erroresRegistro.nombre}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevoRol(false); setRol({ nombre: '' }); setErroresRegistro({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de roles */}
            <Drawer open={isOpenEditarRol} onOpenChange={setIsOpenEditarRol} direction={drawerDirection} onClose={() => { setIsOpenEditarRol(false); setErroresActualizar({}); }} >
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Rol</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Ingrese la información necesaria para editar el rol.</DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL ROL</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del rol"
                                        value={rolEditar.nombre} onChange={(e) => {
                                            setRolEditar({ ...rolEditar, nombre: e.target.value });
                                            // Limpia el error al escribir
                                            if (erroresActualizar.nombre) setErroresActualizar({ ...erroresActualizar, nombre: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {/* Mensaje de error debajo del input */}
                                {erroresActualizar.nombre && (
                                    <p className="text-destructive text-xs mt-1">{erroresActualizar.nombre}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarRol(false); setErroresActualizar({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}