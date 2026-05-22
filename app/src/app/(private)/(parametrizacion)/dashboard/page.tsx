"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button"
import { ChevronRight, CircleUser, PencilLine, Save, EyeIcon, EyeOffIcon, X, Camera } from 'lucide-react';
import { toast } from "@/components/ui/toast-custom";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useUsuarios } from "@/hooks/use-usuario";
import { Usuario } from "@/DTOs/usuario";
import { cards } from "@/constants/dashboard";
import { environment } from "@/lib/api/client";

export default function Dashboard() {
    const { obtenerUsuarioAutenticado, actualizarUsuario, loading } = useUsuarios();
    const [user, setUser] = useState<any>(null);

    const router = useRouter();
    // Filtrar cards según rol del usuario
    const cardsFiltradas = cards.filter(card => card.roles.includes(user?.idRol?.codigo));

    const [cambiarContrasena, setCambiarContrasena] = useState(false); // Habilita edición de contraseña
    const [mostrarContrasena, setMostrarContrasena] = useState(false); // Toogle de tipo de texto en contraseña

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const cargarUsuario = async () => {
        try {
            const res = await obtenerUsuarioAutenticado();
            const fotoUrl = res.data.foto ? `${environment.baseUrl}/${res.data.foto}` : "";
            setUser({
                ...res.data,
                foto: fotoUrl
            });
        } catch (error: any) {
            console.error("Error al obtener usuario autenticado:", error.message);
        }
    };

    useEffect(() => {
        cargarUsuario();
    }, []);

    // Actualizar datos del perfil
    const [editarPerfil, setEditarPerfil] = useState(false); // Habilita edición
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario>({ // Establece usuario a editar
        nombres: '',
        apellidos: '',
        correo: ''
    });

    // Manejo de archivo subido para foto de perfil
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | undefined>(undefined);
    // Referencia al input de carga de archivo
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nombres: usuarioEditar.nombres,
                apellidos: usuarioEditar.apellidos,
                correo: usuarioEditar.correo,
                // Solo incluir foto si se cargo un archivo
                ...(archivoSeleccionado && { foto: archivoSeleccionado }),
                // Solo incluir contraseña si se ingresó una nueva
                ...(usuarioEditar.contrasena && { contrasena: usuarioEditar.contrasena })
            };
            const res = await actualizarUsuario(user._id, payload);
            setEditarPerfil(false);
            setArchivoSeleccionado(undefined);
            cargarUsuario(); // Vuelve a cargar el usuario con la info actualizada
            toast.success(res.message);
        } catch (error: any) {
            console.error("Error al actualizar:", error.message);
            toast.error(error.message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setArchivoSeleccionado(file);
        if (file) {
            // Previsualización de imagen
            const imageUrl = URL.createObjectURL(file);

            // Visualizar imagen subida
            setUser((prev: any) => ({
                ...prev,
                foto: imageUrl
            }));
        }
    };

    return (
        <div className="px-2 py-1">
            <p className="font-bold text-xl">
                Bienvenido, <span className="text-primary">{user?.nombres} {user?.apellidos}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                Panel de parametrización del proceso de titulación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 bg-accent p-4 rounded-md">
                <Card className="md:col-span-2 lg:col-span-1 lg:row-span-2">
                    <CardHeader className="flex flex-col items-center justify-center">
                        <div className="relative">
                            {user?.foto ? (
                                <img src={user?.foto} alt="Foto" className="rounded-full object-cover w-30 h-30" />
                            ) : (
                                <CircleUser className="rounded-full object-cover w-30 h-30" />
                            )}
                            {/* Botón cámara SOLO en modo editar */}
                            {editarPerfil && (
                                <>
                                    <Button type="button" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:scale-105 transition border-2 border-white cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera size={18} />
                                    </Button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </>
                            )}
                        </div>
                        <span className="text-sm md:text-lg font-bold text-primary">{user?.nombreCompleto}</span>
                        <span className="text-sm text-muted-foreground">{user?.idCargo?.nombre}</span>
                    </CardHeader>
                    <form onSubmit={handleActualizar}>
                        <CardContent>
                            {(!editarPerfil) ? (
                                <div className="space-y-2">
                                    <p className="font-bold bg-muted p-2 rounded-md text-primary">Correo: <span className="text-muted-foreground">{user?.correo}</span></p>
                                    <p className="font-bold bg-muted p-2 rounded-md text-primary">Rol: <span className="text-muted-foreground">{user?.idRol?.nombre}</span></p>
                                </div>
                            ) : (
                                <FieldGroup>
                                    <Field>
                                        <InputGroup className='py-5 px-2 bg-secondary'>
                                            <InputGroupAddon align="inline-start" className="text-primary font-bold">
                                                Nombres:
                                            </InputGroupAddon>
                                            <InputGroupInput id="nombres" type="text" placeholder="Ingrese los nombres del usuario" required
                                                value={usuarioEditar.nombres} onChange={(e) => setUsuarioEditar({ ...usuarioEditar, nombres: e.target.value })}
                                                className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <InputGroup className='py-5 px-2 bg-secondary'>
                                            <InputGroupAddon align="inline-start" className="text-primary font-bold">
                                                Apellidos:
                                            </InputGroupAddon>
                                            <InputGroupInput id="apellidos" type="text" placeholder="Ingrese los apellidos del usuario" required
                                                value={usuarioEditar.apellidos} onChange={(e) => setUsuarioEditar({ ...usuarioEditar, apellidos: e.target.value })}
                                                className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <InputGroup className='py-5 px-2 bg-secondary'>
                                            <InputGroupAddon align="inline-start" className="text-primary font-bold">
                                                Correo:
                                            </InputGroupAddon>
                                            <InputGroupInput id="correo" type="text" placeholder="Ingrese su correo" required
                                                value={usuarioEditar.correo} onChange={(e) => setUsuarioEditar({ ...usuarioEditar, correo: e.target.value })}
                                                className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                        </InputGroup>
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
                                                    placeholder="Ingrese la nueva contraseña" required value={usuarioEditar.contrasena}
                                                    onChange={(e) => setUsuarioEditar({ ...usuarioEditar, contrasena: e.target.value })}
                                                    className="text-sm md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm" />
                                                <InputGroupAddon align="inline-end">
                                                    <Button type="button" variant="ghost" onClick={toggleMostrarContrasena} className="cursor-pointer">
                                                        {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                                                    </Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    </Field>
                                </FieldGroup>
                            )}
                        </CardContent>
                        <CardFooter className="flex items-center justify-center mt-4">
                            {(!editarPerfil) ? (
                                <Button variant={"ghost"} className="border-2 border-primary bg-primary/20 text-primary"
                                    onClick={() => {
                                        setEditarPerfil(true);
                                        setUsuarioEditar(user);
                                    }}>
                                    <PencilLine /> Editar perfil
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button type="submit" variant={"ghost"} disabled={loading} className="border-2 border-primary bg-primary/20 text-primary">
                                        {loading ? "Actualizando..." : <><Save /> Guardar cambios</>}
                                    </Button>
                                    <Button type="button" variant={"ghost"} className="border-2 border-destructive bg-destructive/20 text-destructive"
                                        onClick={() => {
                                            setEditarPerfil(false);
                                            setArchivoSeleccionado(undefined);
                                            cargarUsuario();
                                        }}>
                                        <X /> Cancelar
                                    </Button>
                                </div>
                            )}
                        </CardFooter>
                    </form>
                </Card>
                {/* Cards filtradas por rol */}
                {cardsFiltradas.map((card) => (
                    <Card key={card.title}>
                        <CardHeader>
                            <CardTitle>
                                <div className={`w-fit p-3 rounded-xl ${card.buttonClass}`}>
                                    <card.icon />
                                </div>
                            </CardTitle>
                            <CardDescription className="font-bold text-foreground text-lg">
                                {card.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{card.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" className={`border-2 ${card.buttonClass}`} onClick={() => router.push(card.route)}>
                                {card.buttonLabel} <ChevronRight />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
