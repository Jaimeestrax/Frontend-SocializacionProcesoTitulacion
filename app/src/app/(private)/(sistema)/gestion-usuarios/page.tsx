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
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Iconos
import { Users, UserPlus, CircleUser, FileEdit, CircleX, ToggleLeft, ToggleRight, EyeOffIcon, EyeIcon, TextSearch } from 'lucide-react';

// Utilidades
import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Usuario } from "@/DTOs/usuario";

// Uso de hooks que interactuan con la API
import { useUsuarios } from "@/hooks/use-usuario";
import { useRoles } from "@/hooks/use-rol";
import { useCargos } from "@/hooks/use-cargo";
import { useDrawerDirection } from "@/hooks/use-drawer-size";

import { environment } from "@/lib/api/client";

export default function GestionUsuarios() {

    const { registrarUsuario, obtenerUsuarios, actualizarEstadoUsuario, actualizarUsuario, obtenerUsuarioPorId, loading } = useUsuarios();
    const { listarRoles } = useRoles();
    const { listarCargos } = useCargos();
    const drawerDirection = useDrawerDirection();
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

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

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<{
        nombres?: string,
        apellidos?: string,
        correo?: string,
        usuario?: string,
        contrasena?: string,
        idRol?: string,
        idCargo?: string,
        idCarrera?: string
    }>({});

    const [erroresActualizar, setErroresActualizar] = useState<{
        nombres?: string,
        apellidos?: string,
        correo?: string,
        usuario?: string,
        contrasena?: string,
        idRol?: string,
        idCargo?: string,
        idCarrera?: string
    }>({});

    // Roles
    const [rolesDisponibles, setRolesDisponibles] = useState<any[]>([]);
    // Cargos
    const [cargosDisponibles, setCargosDisponibles] = useState<any[]>([]);

    // Listado de usuarios
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

    // Carga de roles y cargos
    const cargarSelectores = async () => {
        try {
            // Llamada concurrente
            const [resRoles, resCargos] = await Promise.all([
                listarRoles(),
                listarCargos(),
            ]);
            setRolesDisponibles(resRoles.data);
            setCargosDisponibles(resCargos.data);
        } catch (error: any) {
            console.error("Error al cargar selectores:", error.message);
            //toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => { cargarSelectores(); }, []);
    useEffect(() => { cargarUsuarios(); }, [busqueda]);

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
        idCarrera: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: {
            nombres?: string,
            apellidos?: string,
            correo?: string,
            usuario?: string,
            contrasena?: string,
            idRol?: string,
            idCargo?: string,
            idCarrera?: string
        } = {};
        if (!usuario.nombres.trim()) nuevosErrores.nombres = "El nombre del usuario es requerido";
        if (!usuario.apellidos.trim()) nuevosErrores.apellidos = "El apellido del usuario es requerido";
        if (!usuario.correo.trim()) nuevosErrores.correo = "El correo del usuario es requerido";
        if (!usuario.usuario) nuevosErrores.usuario = "El usuario es requerido";
        if (!usuario.contrasena) nuevosErrores.contrasena = "La contraseña es requerida";
        if (!usuario.idRol) nuevosErrores.idRol = "El rol es requerido";
        if (!usuario.idCargo) nuevosErrores.idCargo = "El cargo es requerido";
        if (!usuario.idCarrera) nuevosErrores.idCarrera = "La carrera es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

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
                idCarrera: ""
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
        idRol: "",
        idCargo: "",
        idCarrera: ""
    });

    const [usuarioEditarId, setUsuarioEditarId] = useState<string>("");
    const [cambiarContrasena, setCambiarContrasena] = useState(false);

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

        // Validación
        const nuevosErrores: {
            nombres?: string,
            apellidos?: string,
            correo?: string,
            usuario?: string,
            contrasena?: string,
            idRol?: string,
            idCargo?: string,
            idCarrera?: string
        } = {};
        if (!usuarioEditar.nombres.trim()) nuevosErrores.nombres = "El nombre del usuario es requerido";
        if (!usuarioEditar.apellidos.trim()) nuevosErrores.apellidos = "El apellido del usuario es requerido";
        if (!usuarioEditar.correo.trim()) nuevosErrores.correo = "El correo del usuario es requerido";
        if (!usuarioEditar.usuario) nuevosErrores.usuario = "El usuario es requerido";
        if (!usuarioEditar.contrasena) nuevosErrores.contrasena = "La contraseña es requerida";
        if (!usuarioEditar.idRol) nuevosErrores.idRol = "El rol es requerido";
        if (!usuarioEditar.idCargo) nuevosErrores.idCargo = "El cargo es requerido";
        if (!usuarioEditar.idCarrera) nuevosErrores.idCarrera = "La carrera es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

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

    // Record <key, type> -> Ayuda a la creación de diccionarios con llaves como string
    const cargoColors: Record<string, string> = {
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
                {/** Buscador */}
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por nombres, apellidos, correo o usuario..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    {/* <TableCaption>Listado de usuarios</TableCaption> */}
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Foto</TableHead>
                            <TableHead className="text-center">Usuario</TableHead>
                            <TableHead className="text-center">Rol</TableHead>
                            <TableHead className="text-center">Cargo</TableHead>
                            <TableHead className="text-center">Carrera</TableHead>
                            <TableHead className="text-center">Desde</TableHead>
                            {/* <TableHead className="text-center">Hasta</TableHead> */}
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {usuarios.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                    No hay usuarios registrados
                                </TableCell>
                            </TableRow>
                        )}
                        {usuarios.map((usuario, i) => (
                            <TableRow key={usuario._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell className="flex items-center justify-center">
                                    {usuario.foto ? (
                                        <img src={`${environment.baseUrl}/${usuario.foto}`} alt="Foto" className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <CircleUser className="w-8 h-8" />
                                    )}
                                </TableCell>
                                <TableCell className="text-left">
                                    {usuario.nombreCompleto}
                                    <br />
                                    <span className="text-xs md:text-sm text-muted-foreground">{usuario.correo}</span>
                                </TableCell>
                                <TableCell>{usuario.idRol.nombre}</TableCell>
                                <TableCell>{
                                    <Badge className={`px-5 py-3 ${cargoColors[usuario.idCargo.nombre] || "bg-primary/60 text-foreground"}`}>
                                        {usuario.idCargo.nombre}
                                    </Badge>
                                }</TableCell>
                                <TableCell>{
                                    <Badge className="px-5 py-3 bg-primary/60 text-foreground">
                                        {usuario.idCarrera.nombre}
                                    </Badge>
                                }</TableCell>
                                <TableCell>{formatearFecha(usuario.fechaInicio)}</TableCell>
                                {/* <TableCell>{formatearFecha(usuario.fechaFin)}</TableCell> */}
                                <TableCell>{
                                    usuario.estado ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Activo</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">Inactivo</Badge>
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
                                        {usuario.estado === 1 ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleCambioEstado(usuario._id, 0)}>
                                                        <ToggleRight className="text-warning" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Desactivar</TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-success/60" onClick={() => handleCambioEstado(usuario._id, 1)}>
                                                        <ToggleLeft className="text-success-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Activar</TooltipContent>
                                            </Tooltip>
                                        )}
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

            {/** Drawer de registro de usuarios */}
            <Drawer open={isOpenNuevoUsuario} onOpenChange={setIsOpenNuevoUsuario} direction={drawerDirection}
                onClose={() => {
                    setUsuario({ nombres: '', apellidos: '', correo: '', usuario: '', contrasena: '', idRol: '', idCargo: '' });
                    setErroresRegistro({});
                }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Usuario</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar el usuario.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="space-y-4 px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombres" className="text-xs">NOMBRES</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.nombres ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombres" type="text" placeholder="Ingrese los nombres del usuario"
                                        value={usuario.nombres} onChange={(e) => {
                                            setUsuario({ ...usuario, nombres: e.target.value });
                                            if (erroresRegistro.nombres) setErroresRegistro({ ...erroresRegistro, nombres: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.nombres ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.nombres && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.nombres}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="apellidos" className="text-xs">APELLIDOS</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.apellidos ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="apellidos" type="text" placeholder="Ingrese los apellidos del usuario"
                                        value={usuario.apellidos} onChange={(e) => {
                                            setUsuario({ ...usuario, apellidos: e.target.value });
                                            if (erroresRegistro.apellidos) setErroresRegistro({ ...erroresRegistro, apellidos: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.apellidos ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.apellidos && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.apellidos}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="correo" className="text-xs">CORREO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.correo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="correo" type="text" placeholder="Ingrese el correo institucional del usuario"
                                        value={usuario.correo} onChange={(e) => {
                                            setUsuario({ ...usuario, correo: e.target.value });
                                            if (erroresRegistro.correo) setErroresRegistro({ ...erroresRegistro, correo: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.correo ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.correo && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.correo}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="usuario" className="text-xs">USUARIO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.usuario ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="usuario" type="text" placeholder="Ingrese el nombre de usuario"
                                        value={usuario.usuario} onChange={(e) => {
                                            setUsuario({ ...usuario, usuario: e.target.value });
                                            if (erroresRegistro.usuario) setErroresRegistro({ ...erroresRegistro, usuario: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.usuario ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.usuario && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.usuario}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="contrasena" className="text-xs">CONTRASEÑA</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.contrasena ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="contrasena" type={mostrarContrasena ? "text" : "password"} placeholder="Ingrese la contraseña"
                                        value={usuario.contrasena} onChange={(e) => {
                                            setUsuario({ ...usuario, contrasena: e.target.value });
                                            if (erroresRegistro.contrasena) setErroresRegistro({ ...erroresRegistro, contrasena: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.contrasena ? 'placeholder:text-destructive/50' : ''}`} />
                                    <InputGroupAddon align="inline-end">
                                        <Button type="button" variant="ghost" onClick={toggleMostrarContrasena} className="cursor-pointer">
                                            {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {erroresRegistro.contrasena && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.contrasena}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="idRol" className="text-xs">ROL</FieldLabel>
                                <Select value={usuario.idRol}
                                    onValueChange={(e) => {
                                        setUsuario({ ...usuario, idRol: e })
                                        if (erroresRegistro.idRol) setErroresRegistro({ ...erroresRegistro, idRol: undefined });
                                    }}>
                                    <SelectTrigger className={`w-full ${erroresRegistro.idRol ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                        <SelectValue placeholder="Seleccione un rol" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            {rolesDisponibles?.map((rol) => (
                                                <SelectItem key={rol._id} value={rol._id} className="text-xs md:text-sm">
                                                    {rol.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {erroresRegistro.idRol && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.idRol}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="idCargo" className="text-xs">CARGO</FieldLabel>
                                <Select value={usuario.idCargo}
                                    onValueChange={(e) => {
                                        setUsuario({ ...usuario, idCargo: e })
                                        if (erroresRegistro.idCargo) setErroresRegistro({ ...erroresRegistro, idCargo: undefined });
                                    }}>
                                    <SelectTrigger className={`w-full ${erroresRegistro.idCargo ? 'border-destructive bg-destructive/10 text-destructive' : ''}`}>
                                        <SelectValue placeholder="Seleccione un cargo" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            {cargosDisponibles?.map((cargo) => (
                                                <SelectItem key={cargo._id} value={cargo._id} className="text-xs md:text-sm">
                                                    {cargo.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {erroresRegistro.idCargo && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.idCargo}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevoUsuario(false); setErroresRegistro({}); setUsuario({ nombres: "", apellidos: "", correo: "", usuario: "", contrasena: "", idRol: "", idCargo: "" }); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de usuarios */}
            <Drawer open={isOpenEditarUsuario} onOpenChange={setIsOpenEditarUsuario} direction={drawerDirection} onClose={() => { setIsOpenEditarUsuario(false); setCambiarContrasena(false); setErroresActualizar({}); }} >
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Usuario</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Ingrese la información necesaria para editar el usuario.</DrawerDescription>
                    </DrawerHeader>

                    <form className="space-y-4 px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombres" className="text-xs">NOMBRES</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.nombres ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombres" type="text" placeholder="Ingrese los nombres del usuario"
                                        value={usuarioEditar.nombres} onChange={(e) => {
                                            setUsuarioEditar({ ...usuarioEditar, nombres: e.target.value });
                                            if (erroresActualizar.nombres) setErroresActualizar({ ...erroresActualizar, nombres: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.nombres ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.nombres && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.nombres}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="apellidos" className="text-xs">APELLIDOS</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.apellidos ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="apellidos" type="text" placeholder="Ingrese los apellidos del usuario"
                                        value={usuarioEditar.apellidos} onChange={(e) => {
                                            setUsuarioEditar({ ...usuarioEditar, apellidos: e.target.value });
                                            if (erroresActualizar.apellidos) setErroresActualizar({ ...erroresActualizar, apellidos: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.apellidos ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.apellidos && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.apellidos}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="correo" className="text-xs">CORREO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.correo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="correo" type="text" placeholder="Ingrese el correo institucional del usuario"
                                        value={usuarioEditar.correo} onChange={(e) => {
                                            setUsuarioEditar({ ...usuarioEditar, correo: e.target.value });
                                            if (erroresActualizar.correo) setErroresActualizar({ ...erroresActualizar, correo: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.correo ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.correo && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.correo}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="usuario" className="text-xs">USUARIO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.usuario ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="usuario" type="text" placeholder="Ingrese el nombre de usuario"
                                        value={usuarioEditar.usuario} onChange={(e) => {
                                            setUsuarioEditar({ ...usuarioEditar, usuario: e.target.value });
                                            if (erroresActualizar.usuario) setErroresActualizar({ ...erroresActualizar, usuario: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.usuario ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.usuario && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.usuario}</p>
                                )}
                            </Field>
                            <Field>
                                <div className="flex">
                                    <FieldLabel htmlFor="contrasena" className="text-xs">CAMBIAR CONTRASEÑA</FieldLabel>
                                    <InputGroupInput id="cambiarContrasena" type="checkbox" checked={cambiarContrasena}
                                        onChange={(e) => {
                                            setCambiarContrasena(e.target.checked);
                                            if (!e.target.checked) {
                                                setUsuarioEditar({ ...usuarioEditar, contrasena: "" });
                                            }
                                        }}
                                        className="h-5 w-5 cursor-pointer accent-primary"
                                    />
                                </div>

                                {cambiarContrasena && (
                                    <InputGroup className='py-5 px-2 bg-secondary'>
                                        <InputGroupInput id="contrasena" type={mostrarContrasena ? "text" : "password"}
                                            placeholder="Ingrese la nueva contraseña"
                                            value={usuarioEditar.contrasena} onChange={(e) => setUsuarioEditar({ ...usuarioEditar, contrasena: e.target.value })}
                                            className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                        <InputGroupAddon align="inline-end">
                                            <Button type="button" variant="ghost" onClick={toggleMostrarContrasena} className="cursor-pointer">
                                                {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="idRol" className="text-xs">ROL</FieldLabel>
                                <Select value={usuarioEditar.idRol}
                                    onValueChange={(e) => {
                                        setUsuarioEditar({ ...usuarioEditar, idRol: e });
                                        if (erroresActualizar.idRol) setErroresActualizar({ ...erroresActualizar, idRol: undefined });
                                    }}>
                                    <SelectTrigger className={`w-full ${erroresActualizar.idRol ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                        <SelectValue placeholder="Escoja un rol" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            {rolesDisponibles?.map((rol) => (
                                                <SelectItem key={rol._id} value={rol._id} className="text-xs md:text-sm">
                                                    {rol.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {erroresActualizar.idRol && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.idRol}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="idCargo" className="text-xs">CARGO</FieldLabel>
                                <Select value={usuarioEditar.idCargo}
                                    onValueChange={(e) => {
                                        setUsuarioEditar({ ...usuarioEditar, idCargo: e });
                                        if (erroresActualizar.idCargo) setErroresActualizar({ ...erroresActualizar, idCargo: undefined });
                                    }}>
                                    <SelectTrigger className={`w-full ${erroresActualizar.idCargo ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                        <SelectValue placeholder="Indique el cargo" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            {cargosDisponibles?.map((cargo) => (
                                                <SelectItem key={cargo._id} value={cargo._id} className="text-xs md:text-sm">
                                                    {cargo.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {erroresActualizar.idCargo && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.idCargo}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarUsuario(false); setErroresActualizar({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}