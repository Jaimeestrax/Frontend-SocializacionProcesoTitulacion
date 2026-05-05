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

import { Button } from "@/components/ui/button"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast-custom";
import FileUploadField from "@/components/ui/fileUpload";
import { Badge } from "@/components/ui/badge";

// Iconos
import { Users, UserPlus, FileEdit, CircleX, FileDown } from 'lucide-react';

// Utilidades
import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Usuario } from "@/DTOs/usuario";

// Uso de hooks que interactuan con la API
import { useUsuario } from "@/hooks/use-usuario";
import { useDrawerDirection } from "@/hooks/use-drawer-size";


export default function GestionUsuarios() {

    const { registrarUsuario, obtenerUsuarios, actualizarEstadoUsuario, actualizarUsuario, obtenerUsuarioPorId, loading } = useUsuario();
    const drawerDirection = useDrawerDirection();

    // Listado de usuarios
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    // Total de usuarios
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    // Llamada asincrona reutilizable
    const cargarUsuarios = async () => {
        try {
            const res = await obtenerUsuarios(busqueda);
            setUsuarios(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalUsuarios(res.data.totalDocs);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener usuarios:", error.message);
            toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => {
        cargarUsuarios();
    }, [busqueda]);

    // Registro de usuarios
    const [isOpenNuevoUsuario, setIsOpenNuevoUsuario] = useState(false);

    const [usuario, setUsuario] = useState<Usuario>({
        nombres: "",
        apellidos: "",
        correo: "",
        usuario: "",
        contrasena: "",
        idRol: "",
        idCargo: "",
        descripcion: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await registrarUsuario(usuario);
            // Recarga la lista de usuarios
            await cargarUsuarios();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setUsuario({
                nombres: "",
                apellidos: "",
                correo: "",
                usuario: "",
                contrasena: "",
                idRol: "",
                idCargo: "",
                descripcion: ""
            });
            setIsOpenNuevoUsuario(false);

        } catch (error: any) {
            console.error("Error al registrar usuario:", error.message);
            toast.error(error.message);
        }
    };

    // Cambio de estado de un usuario
    const handleCambioEstado = async (id: string, estado: number) => {
        try {
            const res = await actualizarEstadoUsuario(id, { estado });
            await cargarUsuarios();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado usuario:", error.message);
            toast.error(error.message);
        }
    };

    // Actualizar usuario
    const [isOpenEditarUsuario, setIsOpenEditarUsuario] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario>({
        nombres: "",
        apellidos: "",
        correo: "",
        usuario: "",
        contrasena: "",
        idRol: "",
        idCargo: "",
        descripcion: ""
    });

    const [usuarioEditarId, setUsuarioEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (usuario: any) => {
        try {
            const res = await obtenerUsuarioPorId(usuario._id);
            const usuarioData = res.data;
            setUsuarioEditar(usuarioData);
            setUsuarioEditarId(usuario._id);
            setIsOpenEditarUsuario(true);
        } catch (error: any) {
            console.error("Error al obtener usuario para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await actualizarUsuario(usuarioEditarId, usuarioEditar);
            setIsOpenEditarUsuario(false);
            await cargarUsuarios();
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

    const cargoColors = {
        'Presidente Comisión de Titulación': "bg-purple-200 text-purple-600",
        'Miembro Comisión de Titulación': "bg-blue-200 text-blue-600",
        'Tutor': "bg-green-200 text-green-600",
        'Estudiante': "bg-yellow-200 text-yellow-600",
        'Docente': "bg-cyan-200 text-cyan-600",
        'Secretaria': "bg-gray-200 text-gray-600",
    };

    return (
        <div className="container mx-auto">
            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de usuarios</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Administre a los miembros de la comisión de titulación.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoUsuario(!isOpenNuevoUsuario)}>
                        <UserPlus /> Nuevo usuario
                    </Button>
                </div>
            </div>

            {/** Listado de usuarios */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <Users className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Usuarios</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalUsuarios}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de usuarios</p>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    {/* <TableCaption>Listado de usuarios</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Foto perfil</TableHead>
                            <TableHead className="text-center">Usuario</TableHead>
                            <TableHead className="text-center">Rol</TableHead>
                            <TableHead className="text-center">Cargo</TableHead>
                            <TableHead className="text-center">Desde</TableHead>
                            <TableHead className="text-center">Hasta</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usuarios.map((usuario, i) => (
                            <TableRow key={usuario._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell><img src={usuario.foto} alt="Foto" className="w-10 h-10 rounded-full" /></TableCell>
                                <TableCell className="text-left">
                                    {usuario.nombreCompleto}
                                    <br />
                                    <span className="text-xs md:text-sm text-muted-foreground">{usuario.correo}</span>
                                </TableCell>
                                <TableCell>{usuario.idRol.nombre}</TableCell>
                                <TableCell>{
                                    <Badge
                                        className={`px-5 py-3 text-xs md:text-sm ${cargoColors[usuario.idCargo.nombre] || "bg-primary/60 text-foreground"
                                            }`}
                                    >
                                        {usuario.idCargo.nombre}
                                    </Badge>
                                }</TableCell>
                                <TableCell>{formatearFecha(usuario.fechaInicio)}</TableCell>
                                <TableCell>{formatearFecha(usuario.fechaFin)}</TableCell>
                                <TableCell>{
                                    usuario.estado ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground text-xs md:text-sm">Activo</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground text-xs md:text-sm">Inactivo</Badge>
                                    )
                                }</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(usuario)}>
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(usuario._id, 2)}>
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
                            <PaginationLink href="#">{busqueda.pagina}</PaginationLink>
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

            {/** Drawer de registro de usuarios */}
            {/* <Drawer open={isOpenNuevoUsuario} onOpenChange={setIsOpenNuevoUsuario} direction={drawerDirection} onClose={() => { setUsuario({ nombres: '', apellidos: '', correo: '', password: '', rol: '', cargo: '', foto: null as unknown as File }) }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Usuario</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar el usuario.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="identificador" className="text-xs">IDENTIFICADOR</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupAddon align="inline-start" className="font-bold">
                                        IT-
                                    </InputGroupAddon>
                                    <InputGroupInput id="identificador" type="text" placeholder="OM-1.a" required
                                        value={instrumento.identificador} onChange={(e) => setInstrumento({ ...instrumento, identificador: e.target.value })}
                                        className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL INSTRUMENTO</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento" required
                                        value={instrumento.nombre} onChange={(e) => setInstrumento({ ...instrumento, nombre: e.target.value })}
                                        className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <textarea id="descripcion" placeholder="Ingrese la descripcion del instrumento" rows={4}
                                        value={instrumento.descripcion} onChange={(e) => setInstrumento({ ...instrumento, descripcion: e.target.value })}
                                        className="w-full text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none"
                                    />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FileUploadField id="archivo" label="ARCHIVO" accept=".pdf,.docx" required
                                    onChange={(file) =>
                                        setInstrumento({ ...instrumento, archivo: file as File })
                                    }
                                />
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => setIsOpenNuevoInstrumento(false)}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer> */}

            {/** Drawer de edición de instrumentos */}
            {/* <Drawer open={isOpenEditarInstrumento} onOpenChange={setIsOpenEditarInstrumento} direction={drawerDirection}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Instrumento</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Ingrese la información necesaria para editar el instrumento.</DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="identificador" className="text-xs">IDENTIFICADOR</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="identificador" type="text" placeholder="Ingrese el identificador del instrumento" required
                                        value={instrumentoEditar.identificador} onChange={(e) => setInstrumentoEditar({ ...instrumentoEditar, identificador: e.target.value })}
                                        className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL INSTRUMENTO</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento" required
                                        value={instrumentoEditar.nombre} onChange={(e) => setInstrumentoEditar({ ...instrumentoEditar, nombre: e.target.value })}
                                        className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <textarea id="descripcion" placeholder="Ingrese la descripcion del instrumento" rows={4}
                                        value={instrumentoEditar.descripcion} onChange={(e) => setInstrumentoEditar({ ...instrumentoEditar, descripcion: e.target.value })}
                                        className="w-full text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm resize-none outline-none"
                                    />
                                </InputGroup>
                            </Field>
                            <Field>
                                {instrumentoEditar.ruta && (
                                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-md mb-2">
                                        <FileDown className="text-warning h-4 w-4" />
                                        <span className="text-sm truncate flex-1">
                                            {instrumentoEditar.ruta.replace(/\\/g, '/').split('/').pop()}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-destructive/10 h-6 w-6"
                                            onClick={() => setInstrumentoEditar({ ...instrumentoEditar, ruta: "" })}
                                        >
                                            <CircleX className="text-destructive h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                {!instrumentoEditar.ruta && (
                                    <FileUploadField
                                        id="archivo-editar"
                                        label="NUEVO ARCHIVO"
                                        accept=".pdf,.docx"
                                        onChange={(file) => setInstrumentoEditar({ ...instrumentoEditar, archivo: file as File })}
                                    />
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button onClick={handleActualizar} className="md:py-6">Actualizar</Button>
                            <Button onClick={() => setIsOpenEditarInstrumento(false)} variant="outline" className="md:py-6">Cancelar</Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer> */}
        </div>
    );
}