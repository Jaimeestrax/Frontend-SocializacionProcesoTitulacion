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
import { toast } from "@/components/ui/toast-custom";
import FileUploadField from "@/components/ui/fileUpload";
import { Badge } from "@/components/ui/badge";

// Iconos
import { FilePlusCorner, FileEdit, CircleX, FileDown, CircleCheck, History, TextSearch } from 'lucide-react';

// Utilidades
import { useState, useEffect } from "react";
import { Busqueda } from "@/constants/busqueda";
import { Instrumento } from "@/DTOs/instrumento";

// Uso de hooks que interactuan con la API
import { useInstrumentos } from "@/hooks/use-instrumento";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { environment } from "@/lib/api/client";

export default function GestionInstrumentos() {
    const {
        registrarInstrumento,
        obtenerInstrumentos,
        actualizarVigenciaInstrumento,
        actualizarInstrumento,
        obtenerInstrumentoPorId,
        obtenerHistoricoInstrumento,
        contarInstrumentosVigentes,
        loading
    } = useInstrumentos();

    const drawerDirection = useDrawerDirection();

    // Listado de instrumentos
    const [instrumentos, setInstrumentos] = useState<any[]>([]);
    const [siguiente, setSiguiente] = useState(false);
    const [anterior, setAnterior] = useState(false);
    // Total de instrumentos
    const [totalInstrumentos, setTotalInstrumentos] = useState(0);
    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [erroresRegistro, setErroresRegistro] = useState<{
        nombre?: string;
        descripcion?: string;
        archivo?: string;
    }>({});

    const [erroresActualizar, setErroresActualizar] = useState<{
        nombre?: string;
        descripcion?: string;
        archivo?: string;
    }>({});

    const [resetArchivo, setResetArchivo] = useState(false);

    // Llamada asincrona reutilizable
    const cargarInstrumentos = async () => {
        try {
            const res = await obtenerInstrumentos(busqueda);
            const res2 = await contarInstrumentosVigentes();
            setInstrumentos(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalInstrumentos(res2.data);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener instrumentos:", error.message);
            toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => {
        cargarInstrumentos();
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

    // Registro de instrumentos
    const [isOpenNuevoInstrumento, setIsOpenNuevoInstrumento] = useState(false);

    const [instrumento, setInstrumento] = useState<Instrumento>({
        nombre: "",
        descripcion: "",
        idEncargadoGenerar: "",
        archivo: null as unknown as File
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: {
            nombre?: string,
            descripcion?: string,
            archivo?: string
        } = {};
        if (!instrumento.nombre.trim()) nuevosErrores.nombre = "El nombre del instrumento es requerido";
        if (!instrumento.descripcion) nuevosErrores.descripcion = "La descripción del instrumento es requerida";
        if (!instrumento.archivo) nuevosErrores.archivo = "El archivo es requerido";

        // Si es archivo subido
        if (instrumento.archivo && instrumento.archivo instanceof File) {
            const extensionesPermitidas = ["pdf", "doc", "docx"];
            const extension = instrumento.archivo.name.split(".").pop()?.toLowerCase();

            if (!extension || !extensionesPermitidas.includes(extension)) {
                nuevosErrores.archivo = "Solo se permiten archivos PDF o DOC.";
            }
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresRegistro(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresRegistro({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await registrarInstrumento({ ...instrumento, idEncargadoGenerar: user._id });
            // Recarga la lista de instrumentos
            await cargarInstrumentos();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setInstrumento({
                nombre: "",
                descripcion: "",
                idEncargadoGenerar: "",
                archivo: null as unknown as File
            });
            setIsOpenNuevoInstrumento(false);

        } catch (error: any) {
            console.error("Error al registrar instrumento:", error.message);
            toast.error(error.message);
        }
    };

    // Cambio de vigencia de un instrumento
    const handleCambioVigencia = async (id: string, vigente: boolean) => {
        try {
            const res = await actualizarVigenciaInstrumento(id, { vigente });
            await cargarInstrumentos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar vigencia del instrumento:", error.message);
            toast.error(error.message);
        }
    };

    // Descargar achivo de un instrumento
    const handleDescarga = (instrumento: any) => {
        const url = `${environment.baseUrl}/${instrumento.archivo}`;
        window.open(url, '_blank'); // Abre en otra pestaña
    };

    // Actualizar instrumento
    const [isOpenEditarInstrumento, setIsOpenEditarInstrumento] = useState(false);
    const [instrumentoEditar, setInstrumentoEditar] = useState<Instrumento>({
        nombre: "",
        descripcion: "",
        idEncargadoActualizar: "",
        archivo: null as unknown as File
    });
    const [instrumentoEditarId, setInstrumentoEditarId] = useState<string>("");

    // Abrir drawer de edición
    const handleEditar = async (instrumento: any) => {
        try {
            const res = await obtenerInstrumentoPorId(instrumento._id);
            const instrumentoData = res.data;
            setInstrumentoEditar(instrumentoData);
            setInstrumentoEditarId(instrumento._id);
            setIsOpenEditarInstrumento(true);
        } catch (error: any) {
            console.error("Error al obtener instrumento para editar:", error.message);
            toast.error(error.message);
        }
    };

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validación
        const nuevosErrores: {
            nombre?: string,
            descripcion?: string,
            archivo?: string
        } = {};
        if (!instrumentoEditar.nombre.trim()) nuevosErrores.nombre = "El nombre del instrumento es requerido";
        if (!instrumentoEditar.descripcion) nuevosErrores.descripcion = "La descripción del instrumento es requerida";
        if (!instrumentoEditar.archivo) nuevosErrores.archivo = "El archivo es requerido";

        // Si es archivo subido
        if (instrumento.archivo && instrumento.archivo instanceof File) {
            const extensionesPermitidas = ["pdf", "doc", "docx"];
            const extension = instrumento.archivo.name.split(".").pop()?.toLowerCase();

            if (!extension || !extensionesPermitidas.includes(extension)) {
                nuevosErrores.archivo = "Solo se permiten archivos PDF o DOC.";
            }
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresActualizar(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresActualizar({});

        try {
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await actualizarInstrumento(instrumentoEditarId, { ...instrumentoEditar, idEncargadoActualizar: user._id });
            setIsOpenEditarInstrumento(false);
            await cargarInstrumentos();
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

    // Modal con historico de un instrumento
    const [isOpenHistoricoInstrumento, setIsOpenHistoricoInstrumento] = useState(false);
    const [historicoInstrumento, setHistoricoInstrumento] = useState<any[]>([]);

    // Abrir modal con historico de un instrumento
    const handleHistorico = async (instrumento: any) => {
        try {
            const res = await obtenerHistoricoInstrumento(instrumento.codigo);
            setHistoricoInstrumento(res.data);
            setIsOpenHistoricoInstrumento(true);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener historico del instrumento:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="container mx-auto">
            {/** Encabezado */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de instrumentos</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">
                        Defina los intrumentos a ser utilizados en proceso de titulación.
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoInstrumento(!isOpenNuevoInstrumento)}>
                        <FilePlusCorner /> Nuevo instrumento
                    </Button>
                </div>
            </div>

            {/** Listado de instrumentos */}
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                    <Card size="sm" className="p-2 lg:p-4">
                        <div className="flex items-center justify-left gap-2">
                            <FilePlusCorner className="w-16 h-16 text-primary bg-primary/10 p-4 rounded-md" />
                            <CardHeader>
                                <CardTitle>Instrumentos</CardTitle>
                                <CardDescription className="font-bold text-xl lg:text-2xl">{totalInstrumentos}</CardDescription>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
                <p className="p-4 font-bold text-sm md:text-md">Listado de instrumentos</p>
                {/** Buscador */}
                <div className="flex items-center justify-center mb-4">
                    <InputGroup className="p-2 bg-background w-full md:w-1/2 hover:border-primary">
                        <InputGroupAddon align="inline-start">
                            <TextSearch />
                        </InputGroupAddon>
                        <InputGroupInput type="text" placeholder="Buscar por nombre o descripción..."
                            value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)}
                            className="text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm"
                        />
                    </InputGroup>
                </div>
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    {/* <TableCaption>Listado de instrumentos</TableCaption> */}
                    <TableHeader className="text-xs lg:text-sm bg-muted-foreground/25">
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            {/* <TableHead className="text-center">Código</TableHead> */}
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Descripción</TableHead>
                            <TableHead className="text-center">Generado por</TableHead>
                            <TableHead className="text-center">Condición</TableHead>
                            <TableHead className="text-center">Fecha inicio</TableHead>
                            <TableHead className="text-center">Fecha fin</TableHead>
                            <TableHead className="text-center">Version</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs lg:text-sm">
                        {instrumentos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                    No hay instrumentos registrados
                                </TableCell>
                            </TableRow>
                        )}
                        {instrumentos.map((instrumento, i) => (
                            <TableRow key={instrumento._id}>
                                <TableCell className="text-center">{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                {/* <TableCell>{instrumento.codigo}</TableCell> */}
                                <TableCell className="max-w-sm whitespace-normal wrap-break-words">{instrumento.nombre}</TableCell>
                                <TableCell className="max-w-sm whitespace-normal wrap-break-words">{instrumento.descripcion}</TableCell>
                                <TableCell className="text-center">{instrumento.idEncargadoGenerar.nombres + ' ' + instrumento.idEncargadoGenerar.apellidos}</TableCell>
                                <TableCell className="text-center">{
                                    instrumento.vigente ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground">Vigente</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground">No vigente</Badge>
                                    )
                                }</TableCell>
                                <TableCell className="text-center">{formatearFecha(instrumento.fechaInicio)}</TableCell>
                                <TableCell className="text-center">{formatearFecha(instrumento.fechaFin)}</TableCell>
                                <TableCell className="text-center">{instrumento.version}</TableCell>
                                <TableCell className="text-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDescarga(instrumento)}>
                                                    <FileDown className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Descargar</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleEditar(instrumento)}>
                                                    <FileEdit className="text-warning" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioVigencia(instrumento._id, !instrumento.vigente)}>
                                                    {instrumento.vigente ? <CircleX className="text-destructive" /> : <CircleCheck className="text-success-foreground" />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{instrumento.vigente ? "Desactivar" : "Activar"}</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleHistorico(instrumento)}>
                                                    <History className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Ver Histórico</TooltipContent>
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

            {/** Drawer de registro de instrumentos */}
            <Drawer open={isOpenNuevoInstrumento} onOpenChange={setIsOpenNuevoInstrumento} direction={drawerDirection} onClose={() => { setInstrumento({ nombre: '', descripcion: '', idEncargadoGenerar: '', archivo: null as unknown as File }); setErroresRegistro({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Instrumento</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar el instrumento.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL INSTRUMENTO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento"
                                        value={instrumento.nombre} onChange={(e) => {
                                            setInstrumento({ ...instrumento, nombre: e.target.value });
                                            if (erroresRegistro.nombre) setErroresRegistro({ ...erroresRegistro, nombre: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresRegistro.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.nombre && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.nombre}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresRegistro.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <textarea id="descripcion" placeholder="Ingrese la descripcion del instrumento" rows={4}
                                        value={instrumento.descripcion} onChange={(e) => {
                                            setInstrumento({ ...instrumento, descripcion: e.target.value });
                                            if (erroresRegistro.descripcion) setErroresRegistro({ ...erroresRegistro, descripcion: undefined });
                                        }}
                                        className={`w-full text-xs md:text-sm placeholder:text-muted-foreground/50 resize-none outline-none bg-transparent placeholder:text-sm ${erroresRegistro.descripcion ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresRegistro.descripcion && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.descripcion}</p>
                                )}
                            </Field>
                            <Field>
                                <FileUploadField id="archivo" label="ARCHIVO" accept=".pdf,.doc,.docx" reset={resetArchivo}
                                    onChange={(file) => {
                                        if (file) {
                                            const extensionesPermitidas = ["pdf", "doc", "docx"];

                                            const extension = file.name.split(".").pop()?.toLowerCase();

                                            if (!extension || !extensionesPermitidas.includes(extension)) {
                                                setErroresRegistro(prev => ({ ...prev, archivo: "Archivo no valido." }));

                                                setInstrumento(prev => ({ ...prev, archivo: null as unknown as File }));

                                                setResetArchivo(true);

                                                setTimeout(() => {
                                                    setResetArchivo(false);
                                                }, 100);

                                                return;
                                            }
                                        }

                                        setInstrumento(prev => ({ ...prev, archivo: file as File }));
                                        if (file && erroresRegistro.archivo) setErroresRegistro(prev => ({ ...prev, archivo: undefined }));
                                    }}
                                />
                                {erroresRegistro.archivo && (
                                    <p className="text-xs text-destructive mt-1">{erroresRegistro.archivo}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenNuevoInstrumento(false); setErroresRegistro({}); setInstrumento({ nombre: '', descripcion: '', idEncargadoGenerar: '', archivo: null as unknown as File }) }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de instrumentos */}
            <Drawer open={isOpenEditarInstrumento} onOpenChange={setIsOpenEditarInstrumento} direction={drawerDirection} onClose={() => { setIsOpenEditarInstrumento(false); setErroresActualizar({}); }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Editar Instrumento</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Ingrese la información necesaria para editar el instrumento.</DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6 overflow-y-auto" onSubmit={handleActualizar}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL INSTRUMENTO</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.nombre ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento"
                                        value={instrumentoEditar.nombre} onChange={(e) => {
                                            setInstrumentoEditar({ ...instrumentoEditar, nombre: e.target.value });
                                            if (erroresActualizar.nombre) setErroresActualizar({ ...erroresActualizar, nombre: undefined });
                                        }}
                                        className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresActualizar.nombre ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.nombre && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.nombre}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className={`py-5 px-2 ${erroresActualizar.descripcion ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                                    <textarea id="descripcion" placeholder="Ingrese la descripcion del instrumento" rows={4}
                                        value={instrumentoEditar.descripcion} onChange={(e) => {
                                            setInstrumentoEditar({ ...instrumentoEditar, descripcion: e.target.value });
                                            if (erroresActualizar.descripcion) setErroresActualizar({ ...erroresActualizar, descripcion: undefined });
                                        }}
                                        className={`w-full text-xs md:text-sm placeholder:text-muted-foreground/50 resize-none outline-none bg-transparent placeholder:text-sm ${erroresActualizar.descripcion ? 'placeholder:text-destructive/50' : ''}`} />
                                </InputGroup>
                                {erroresActualizar.descripcion && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.descripcion}</p>
                                )}
                            </Field>
                            <Field>
                                {typeof instrumentoEditar.archivo === 'string' && (
                                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-md mb-2">
                                        <FileDown className="text-primary h-4 w-4" />
                                        <span className="text-sm truncate flex-1">
                                            {/* Se muestra código del instrumento y extension del archivo */}
                                            {`IT-00${instrumentoEditar.codigo}.${instrumentoEditar.archivo.split('.').pop()}`}
                                        </span>
                                        {/* Eliminar el archivo actual */}
                                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 h-6 w-6"
                                            onClick={() => setInstrumentoEditar({ ...instrumentoEditar, archivo: null as unknown as File })}>
                                            <CircleX className="text-destructive h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                {typeof instrumentoEditar.archivo !== 'string' && (
                                    <FileUploadField id="archivo-editar" label="ARCHIVO" accept=".pdf,.doc,.docx" reset={resetArchivo}
                                        onChange={(file) => {
                                            if (file) {
                                                const extensionesPermitidas = ["pdf", "doc", "docx"];

                                                const extension = file.name.split(".").pop()?.toLowerCase();

                                                if (!extension || !extensionesPermitidas.includes(extension)) {
                                                    setErroresActualizar(prev => ({ ...prev, archivo: "Archivo no valido." }));

                                                    setInstrumentoEditar(prev => ({ ...prev, archivo: null as unknown as File }));

                                                    setResetArchivo(true);

                                                    setTimeout(() => {
                                                        setResetArchivo(false);
                                                    }, 100);

                                                    return;
                                                }
                                            }
                                            setInstrumentoEditar(prev => ({ ...prev, archivo: file as File }));
                                            if (file && erroresActualizar.archivo) setErroresActualizar(prev => ({ ...prev, archivo: undefined }));
                                        }}
                                    />
                                )}
                                {erroresActualizar.archivo && (
                                    <p className="text-xs text-destructive mt-1">{erroresActualizar.archivo}</p>
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button type="submit" className="md:py-6" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                            <Button type="button" variant="outline" className="md:py-6" onClick={() => { setIsOpenEditarInstrumento(false); setErroresActualizar({}); }}>
                                Cancelar
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Modal para mostrar el historico de un instrumento */}
            <Dialog open={isOpenHistoricoInstrumento} onOpenChange={setIsOpenHistoricoInstrumento}>
                <DialogContent className="overflow-x-auto sm:max-w-xl md:max-w-3xl lg:max-w-4xl" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Histórico del instrumento</DialogTitle>
                        <DialogDescription className="text-xs lg:text-sm">
                            Revise el detalle de las versiones del instrumento:{historicoInstrumento?.[0]?.nombre || ""}
                        </DialogDescription>
                        <div className="mt-2 no-scrollbar max-h-[50vh] overflow-y-auto">
                            <Table className="bg-white dark:bg-gray-900 rounded-lg text-xs lg:text-sm">
                                {/* <TableCaption>Listado de instrumentos</TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Nro</TableHead>
                                        <TableHead className="text-center">Nombre</TableHead>
                                        <TableHead className="text-center">Descripción</TableHead>
                                        <TableHead className="text-center">Generado por</TableHead>
                                        <TableHead className="text-center">Condición</TableHead>
                                        <TableHead className="text-center">Fecha inicio</TableHead>
                                        <TableHead className="text-center">Fecha fin</TableHead>
                                        <TableHead className="text-center">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historicoInstrumento.map((instrumento, i) => (
                                        <TableRow key={instrumento._id} className="text-center">
                                            <TableCell>{i + 1}</TableCell>
                                            {/* <TableCell>{instrumento.codigo}</TableCell> */}
                                            <TableCell>{instrumento.nombre}</TableCell>
                                            <TableCell className="max-w-sm whitespace-normal wrap-break-word">{instrumento.descripcion}</TableCell>
                                            <TableCell>{instrumento.idEncargadoGenerar.nombres + ' ' + instrumento.idEncargadoGenerar.apellidos}</TableCell>
                                            <TableCell>{
                                                instrumento.vigente ? (
                                                    <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground text-xs md:text-sm">Vigente</Badge>
                                                ) : (
                                                    <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground text-xs md:text-sm">No vigente</Badge>
                                                )
                                            }</TableCell>
                                            <TableCell>{formatearFecha(instrumento.fechaInicio)}</TableCell>
                                            <TableCell>{formatearFecha(instrumento.fechaFin)}</TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleDescarga(instrumento)}>
                                                                <FileDown className="text-primary" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Descargar</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
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
