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

import { FilePlusCorner, FileEdit, CircleX, FileDown } from 'lucide-react';
import { useState, useEffect } from "react";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast-custom";
import FileUploadField from "@/components/ui/fileUpload";
import { Badge } from "@/components/ui/badge"

// Uso de hooks que interactuan con la API
import { useInstrumentos } from "@/hooks/use-instrumento";
import { Busqueda } from "@/interfaces/busqueda";
import { Instrumento } from "@/DTOs/instrumento";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GestionInstrumentos() {
    const { registrarInstrumento, obtenerInstrumentos, actualizarEstadoInstrumento, actualizarInstrumento, obtenerInstrumentoPorId, loading } = useInstrumentos();
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
        limite: 20,
        palabra: ""
    });

    // Llamada asincrona reutilizable
    const cargarInstrumentos = async () => {
        try {
            const res = await obtenerInstrumentos(busqueda);
            setInstrumentos(res.data.docs);
            setSiguiente(res.data.hasNextPage);
            setAnterior(res.data.hasPrevPage);
            setTotalInstrumentos(res.data.totalDocs);
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

    // Registro de instrumentos
    const [isOpenNuevoInstrumento, setIsOpenNuevoInstrumento] = useState(false);

    const [instrumento, setInstrumento] = useState<Instrumento>({
        identificador: "",
        nombre: "",
        descripcion: "",
        id_encargado: "",
        archivo: null as unknown as File
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            //console.log("Enviando:", instrumento);
            const user = JSON.parse(localStorage.getItem("identity") || "{}");
            const res = await registrarInstrumento({ ...instrumento, id_encargado: user._id });
            // Recarga la lista de instrumentos
            await cargarInstrumentos();
            // Mensaje correcto de registro
            toast.success(res.message);
            // Reinicio del drawer
            setInstrumento({
                identificador: "",
                nombre: "",
                descripcion: "",
                id_encargado: "",
                archivo: null as unknown as File
            });
            setIsOpenNuevoInstrumento(false);

        } catch (error: any) {
            console.error("Error al registrar instrumento:", error.message);
            toast.error(error.message);
        }
    };

    // Cambio de estado de un instrumento
    const handleCambioEstado = async (id: string, estado: boolean) => {
        try {
            const res = await actualizarEstadoInstrumento(id, { estado });
            await cargarInstrumentos();
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar estado instrumento:", error.message);
            toast.error(error.message);
        }
    };

    // Descarga de un instrumento
    const handleDescarga = (instrumento: any) => {
        const rutaNormalizada = instrumento.ruta.replace(/\\/g, '/');
        const url = `${process.env.NEXT_PUBLIC_URL}/${rutaNormalizada}`;

        const link = document.createElement('a');
        link.href = url;
        link.download = instrumento.nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Actualizar instrumento
    const [isOpenEditarInstrumento, setIsOpenEditarInstrumento] = useState(false);
    const [instrumentoEditar, setInstrumentoEditar] = useState<Instrumento>({
        identificador: "",
        nombre: "",
        descripcion: "",
        id_encargado: "",
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
        try {
            const res = await actualizarInstrumento(instrumentoEditarId, instrumentoEditar);
            setIsOpenEditarInstrumento(false);
            await cargarInstrumentos();
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
                <Table className="bg-white dark:bg-gray-900 rounded-lg">
                    {/* <TableCaption>Listado de instrumentos</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Nro</TableHead>
                            <TableHead className="text-center">Identificador</TableHead>
                            <TableHead className="text-center">Nombre</TableHead>
                            <TableHead className="text-center">Descripcion</TableHead>
                            <TableHead className="text-center">Encargado</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {instrumentos.map((instrumento, i) => (
                            <TableRow key={instrumento._id} className="text-center">
                                <TableCell>{(busqueda.pagina - 1) * busqueda.limite + i + 1}</TableCell>
                                <TableCell>{instrumento.identificador}</TableCell>
                                <TableCell>{instrumento.nombre}</TableCell>
                                <TableCell>{instrumento.descripcion}</TableCell>
                                <TableCell>{instrumento.id_encargado.nombres + ' ' + instrumento.id_encargado.apellidos}</TableCell>
                                <TableCell>{
                                    instrumento.estado ? (
                                        <Badge className="px-5 py-3 bg-success hover:bg-success/60 text-foreground text-xs md:text-sm">Activo</Badge>
                                    ) : (
                                        <Badge className="px-5 py-3 bg-destructive hover:bg-destructive/60 text-foreground text-xs md:text-sm">Inactivo</Badge>
                                    )
                                }</TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-warning/10" onClick={() => handleDescarga(instrumento)}>
                                                    <FileDown className="text-warning" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Descargar</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-primary/10" onClick={() => handleEditar(instrumento)}>
                                                    <FileEdit className="text-primary" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Editar</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={() => handleCambioEstado(instrumento._id, !instrumento.estado)}>
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

            {/** Drawer de registro de instrumentos */}
            <Drawer open={isOpenNuevoInstrumento} onOpenChange={setIsOpenNuevoInstrumento} direction={drawerDirection} onClose={() => { setInstrumento({ identificador: '', nombre: '', descripcion: '', id_encargado: '', archivo: null as unknown as File }) }}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Instrumento</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">
                            Ingrese la información necesaria para registrar el instrumento.
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
            </Drawer>

            {/** Drawer de edición de instrumentos */}
            <Drawer open={isOpenEditarInstrumento} onOpenChange={setIsOpenEditarInstrumento} direction={drawerDirection}>
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
            </Drawer>
        </div>
    );
}
