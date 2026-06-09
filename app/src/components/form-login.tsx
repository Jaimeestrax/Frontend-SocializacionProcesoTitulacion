"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

import { User, LockKeyhole, LogIn, EyeOffIcon, EyeIcon } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { toast } from "@/components/ui/toast-custom";

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group";

import { useRouter } from "next/navigation";

export default function FormLogin() {
    const { login, loading } = useAuth();
    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");

    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [erroresAutenticacion, setErroresAutenticacion] = useState<{ usuario?: string, contrasena?: string }>({});

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const nuevosErrores: { usuario?: string, contrasena?: string } = {};
        if (!usuario.trim()) nuevosErrores.usuario = "El usuario es requerido";
        if (!contrasena.trim()) nuevosErrores.contrasena = "La contraseña es requerida";

        if (Object.keys(nuevosErrores).length > 0) {
            setErroresAutenticacion(nuevosErrores);
            toast.error("Complete todos los campos del formulario.");
            return;
        }

        setErroresAutenticacion({});

        try {
            const res = await login(usuario, contrasena);
            toast.success(res.message);

            // Redirigir a dashboard
            router.push("/dashboard");

        } catch (error: any) {
            console.error("Error login:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="usuario">USUARIO</FieldLabel>
                    <InputGroup className={`py-5 px-2 ${erroresAutenticacion.usuario ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                        <InputGroupAddon align="inline-start">
                            <User />
                        </InputGroupAddon>
                        <InputGroupInput id="usuario" type="text" placeholder="Ingrese su nombre de usuario"
                            value={usuario} onChange={(e) => {
                                setUsuario(e.target.value);
                                if (erroresAutenticacion.usuario) setErroresAutenticacion({ ...erroresAutenticacion, usuario: "" });
                            }}
                            className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresAutenticacion.usuario ? 'placeholder:text-destructive/50' : ''}`} />
                    </InputGroup>
                    {erroresAutenticacion.usuario && (
                        <p className="text-xs text-destructive mt-1">{erroresAutenticacion.usuario}</p>
                    )}
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">CONTRASEÑA</FieldLabel>
                        <Link href="/auth/forget-password" className="text-primary ml-auto inline-block text-sm underline-offset-4 hover:underline">
                            OLVIDO SU CONTRASEÑA?
                        </Link>
                    </div>
                    <InputGroup className={`py-5 px-2 ${erroresAutenticacion.contrasena ? 'bg-destructive/10 border border-destructive' : 'bg-secondary'}`}>
                        <InputGroupAddon align="inline-start">
                            <LockKeyhole />
                        </InputGroupAddon>
                        <InputGroupInput id="password" type={mostrarContrasena ? "text" : "password"}
                            value={contrasena} onChange={(e) => {
                                setContrasena(e.target.value);
                                if (erroresAutenticacion.contrasena) setErroresAutenticacion({ ...erroresAutenticacion, contrasena: "" });
                            }}
                            className={`text-xs md:text-sm placeholder:text-muted-foreground/50 placeholder:text-sm ${erroresAutenticacion.contrasena ? 'placeholder:text-destructive/50' : ''}`} />
                        <InputGroupAddon align="inline-end">
                            <Button type="button" variant="ghost" onClick={toggleMostrarContrasena} className="cursor-pointer">
                                {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    {erroresAutenticacion.contrasena && (
                        <p className="text-xs text-destructive mt-1">{erroresAutenticacion.contrasena}</p>
                    )}
                </Field>
                <Field className='flex flex-col gap-2'>
                    <Button variant="default" type="submit" className="py-5 font-bold text-md xl:text-lg" disabled={loading}>
                        {loading ? <><Spinner data-icon="inline-start" />Cargando...</> : <>Iniciar <LogIn /></>}
                    </Button>
                    <Button variant="link" type="button" className="py-5 font-bold text-md xl:text-lg border-2 border-primary"
                        onClick={() => router.push("/")}>
                        Regresar al inicio
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}