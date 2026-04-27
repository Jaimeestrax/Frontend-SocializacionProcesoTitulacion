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

    // Listado de instrumentos
    const [instrumentos, setInstrumentos] = useState<any[]>([]);
    // Se configura la busqueda inicial
    const [busqueda, setBusqueda] = useState<Busqueda>({
        pagina: 1,
        limite: 10,
        palabra: ""
    });

    // Llamada asincrona reutilizable
    const cargarInstrumentos = async () => {
        try {
            const res = await obtenerInstrumentos(busqueda);
            setInstrumentos(res.data.docs);
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener instrumentos:", error.message);
            toast.error(error.message);
        }
    };

    // Carga inicial de la página
    useEffect(() => {
        cargarInstrumentos();
    }, []);

    // Registro de instrumentos
    const [isOpenNuevoInstrumento, setIsOpenNuevoInstrumento] = useState(false);
    const drawerDirection = useDrawerDirection();

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
            // Recarga la lista de instrumentos
            await cargarInstrumentos();

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
            console.error("Error al cambiar estado:", error.message);
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
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-md md:text-xl font-bold">Gestión de instrumentos</h1>
                    <a href="#" className="text-muted-foreground text-xs md:text-sm hover:underline hover:text-primary cursor-pointer">Listado de instrumentos</a>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="p-4 md:px-12 md:py-5 lg:px-24" onClick={() => setIsOpenNuevoInstrumento(!isOpenNuevoInstrumento)}>
                        <FilePlusCorner /> Nuevo instrumento
                    </Button>
                </div>
            </div>
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 md:p-6">
                <p className="p-4 font-bold text-sm md:text-md">Listado de instrumentos</p>
                <Table className="border border-gray-300 dark:border-gray-900">
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
                                <TableCell>{i + 1}</TableCell>
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
                                                <Button variant="ghost" className="hover:bg-destructive/10" onClick={(i) => handleCambioEstado(instrumento._id, !instrumento.estado)}>
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
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        {/** Actual */}
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        {/** Siguiente */}
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/** Drawer de registro de instrumentos */}
            <Drawer open={isOpenNuevoInstrumento} onOpenChange={setIsOpenNuevoInstrumento} direction={drawerDirection}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="font-bold text-md md:text-lg">Registro Instrumento</DrawerTitle>
                        <DrawerDescription className="text-xs md:text-sm">Complete todos los campos para registrar un nuevo instrumento</DrawerDescription>
                    </DrawerHeader>

                    <form className="px-12 py-8 md:px-6 md:py-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="identificador" className="text-xs">IDENTIFICADOR</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupAddon align="inline-start" className="font-bold">
                                        IT-
                                    </InputGroupAddon>
                                    <InputGroupInput id="identificador" type="text" placeholder="OM-1.a" required
                                        value={instrumento.identificador} onChange={(e) => setInstrumento({ ...instrumento, identificador: e.target.value })}
                                        className="text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL INSTRUMENTO</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento" required
                                        value={instrumento.nombre} onChange={(e) => setInstrumento({ ...instrumento, nombre: e.target.value })}
                                        className="text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="descripcion" type="text" placeholder="Ingrese la descripcion del instrumento" required
                                        value={instrumento.descripcion} onChange={(e) => setInstrumento({ ...instrumento, descripcion: e.target.value })}
                                        className="text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FileUploadField id="archivo" label="ARCHIVO" accept=".pdf,.docx,.xlsx,.png,.jpg" required
                                    onChange={(file) =>
                                        setInstrumento({ ...instrumento, archivo: file as File })
                                    }
                                />
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button onClick={handleSubmit} className="md:py-6">Guardar</Button>
                            <Button variant="outline" className="md:py-6">Cancelar</Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>

            {/** Drawer de edición de instrumentos */}
            <Drawer open={isOpenEditarInstrumento} onOpenChange={setIsOpenEditarInstrumento} direction={drawerDirection}>
                <DrawerContent className="p-2 md:p-4">
                    <DrawerHeader>
                        <DrawerTitle className="text-lg md:text-xl">Editar instrumento</DrawerTitle>
                        <DrawerDescription className="text-sm md:text-sm">Modifique los campos necesarios para actualizar el instrumento</DrawerDescription>
                    </DrawerHeader>
                    <form>
                        <FieldGroup className="gap-4 p-4">
                            <Field>
                                <FieldLabel htmlFor="identificador" className="text-xs">IDENTIFICADOR</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="identificador" type="text" placeholder="Ingrese el identificador del instrumento" required
                                        value={instrumentoEditar.identificador} onChange={(e) => setInstrumentoEditar({ ...instrumentoEditar, identificador: e.target.value })}
                                        className="text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre" className="text-xs">NOMBRE DEL INSTRUMENTO</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento" required
                                        value={instrumentoEditar.nombre} onChange={(e) => setInstrumentoEditar({ ...instrumentoEditar, nombre: e.target.value })}
                                        className="text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion" className="text-xs">DESCRIPCION</FieldLabel>
                                <InputGroup className='py-5 px-2 bg-secondary'>
                                    <InputGroupInput id="descripcion" type="text" placeholder="Ingrese la descripcion del instrumento" required
                                        value={instrumentoEditar.descripcion} onChange={(e) => setInstrumentoEditar({ ...instrumentoEditar, descripcion: e.target.value })}
                                        className="text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
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
                                        accept=".pdf,.docx,.xlsx,.png,.jpg"
                                        onChange={(file) => setInstrumentoEditar({ ...instrumentoEditar, archivo: file as File })}
                                    />
                                )}
                            </Field>
                        </FieldGroup>
                        <DrawerFooter className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <Button onClick={handleActualizar} className="md:py-6">Actualizar</Button>
                            <Button variant="outline" className="md:py-6">Cancelar</Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
