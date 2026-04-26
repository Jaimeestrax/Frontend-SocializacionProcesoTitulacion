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
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"

import { FilePlusCorner } from 'lucide-react';
import { useState } from "react";
import { useDrawerDirection } from "@/hooks/use-drawer-size";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast-custom";

// Uso de hooks que interactuan con la API
import { useInstrumentos } from "@/hooks/use-instrumento";
import { Busqueda } from "@/interfaces/busqueda";
import { Instrumento } from "@/DTOs/instrumento";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function GestionInstrumentos() {
    const [isOpenNuevoInstrumento, setIsOpenNuevoInstrumento] = useState(false);
    const drawerDirection = useDrawerDirection();
    const { user } = useAuthContext();
    console.log("user", user?._id);

    const { registrarInstrumento, loading } = useInstrumentos();
    const [instrumento, setInstrumento] = useState<Instrumento>({
        identificador: "",
        nombre: "",
        descripcion: "",
        id_encargado: user?._id || '',
        archivo: null as unknown as File
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            //console.log("Enviando:", instrumento);
            const res = await registrarInstrumento(instrumento);
            toast.success(res.message);

        } catch (error: any) {
            console.error("Error al registrar instrumento:", error.message);
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
            <div className="mt-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="p-4 font-bold text-sm md:text-md">Listado de instrumentos</p>
                <Table className="p-4 border border-gray-300 dark:border-gray-900 overflow-auto">
                    <TableCaption>Listado de instrumentos</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nro</TableHead>
                            <TableHead>Identificador</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Descripcion</TableHead>
                            <TableHead>Encargado</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

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

            <Drawer open={isOpenNuevoInstrumento} onOpenChange={setIsOpenNuevoInstrumento} direction={drawerDirection}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Registro nuevo instrumento</DrawerTitle>
                        <DrawerDescription>Complete todos los campos para registrar un nuevo instrumento</DrawerDescription>
                    </DrawerHeader>

                    <form className="p-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="identificador">IDENTIFICADOR</FieldLabel>
                                <InputGroup className='py-5 px-2'>
                                    <InputGroupAddon align="inline-start">
                                        <FilePlusCorner />
                                    </InputGroupAddon>
                                    <InputGroupInput id="identificador" type="text" placeholder="Ingrese el identificador del instrumento" required
                                        value={instrumento.identificador} onChange={(e) => setInstrumento({ ...instrumento, identificador: e.target.value })} />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="nombre">NOMBRE</FieldLabel>
                                <InputGroup className='py-5 px-2'>
                                    <InputGroupAddon align="inline-start">
                                        <FilePlusCorner />
                                    </InputGroupAddon>
                                    <InputGroupInput id="nombre" type="text" placeholder="Ingrese el nombre del instrumento" required
                                        value={instrumento.nombre} onChange={(e) => setInstrumento({ ...instrumento, nombre: e.target.value })} />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="descripcion">DESCRIPCION</FieldLabel>
                                <InputGroup className='py-5 px-2'>
                                    <InputGroupAddon align="inline-start">
                                        <FilePlusCorner />
                                    </InputGroupAddon>
                                    <InputGroupInput id="descripcion" type="text" placeholder="Ingrese la descripcion del instrumento" required
                                        value={instrumento.descripcion} onChange={(e) => setInstrumento({ ...instrumento, descripcion: e.target.value })} />
                                </InputGroup>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="archivo">ARCHIVO</FieldLabel>
                                <InputGroup className='py-5 px-2'>
                                    <InputGroupAddon align="inline-start">
                                        <FilePlusCorner />
                                    </InputGroupAddon>
                                    <InputGroupInput id="archivo" type="file" required
                                        onChange={(e) => setInstrumento({ ...instrumento, archivo: e.target.files![0] as File })} />
                                </InputGroup>
                            </Field>
                        </FieldGroup>
                        <DrawerFooter>
                            <Button onClick={handleSubmit}>Guardar</Button>
                            <Button variant="outline">Cancelar</Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
