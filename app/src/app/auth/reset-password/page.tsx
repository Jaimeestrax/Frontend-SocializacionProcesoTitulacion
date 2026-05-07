"use client";

import { KeyRound, EyeOffIcon, EyeIcon } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function ResetPasswordPage() {
    // Obtener el token desde url -> params
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    if (!token) {
        // Si no hay token muestra login
        router.replace("/auth/sign-in"); // Replace impide volver a la página anterior y no muestra en historial
        toast.error("El enlace no es válido o ha expirado");
        return;
    }

    const { resetPassword, loading } = useAuth();
    const [contrasena, setContrasena] = useState("");

    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await resetPassword(token, contrasena);
            toast.success(res.message);
            setContrasena(""); // Limpiar input
            router.replace("/auth/sign-in");
        } catch (error: any) {
            console.error("Error al actualizar contraseña:", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-md border border-gray-300 dark:border-gray-900">

            <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center">
                    <img src="/images/logo.png" alt="logo" className="w-18 h-30" />
                </div>
            </div>

            <h2 className="text-center text-xl font-semibold md:text-2xl">
                Recuperación de contraseña
            </h2>

            <p className="text-center text-sm text-muted-foreground mb-6 md:text-md">
                Ingrese su nueva contraseña para actualizarla
            </p>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="contrasena">NUEVA CONTRASEÑA</FieldLabel>
                        <InputGroup className='py-5 px-2'>
                            <InputGroupAddon align="inline-start">
                                <KeyRound />
                            </InputGroupAddon>
                            <InputGroupInput id="contrasena" type={mostrarContrasena ? "text" : "password"} placeholder="Ingrese su nueva contraseña"
                                required value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                            <InputGroupAddon align="inline-end">
                                <Button type="button" variant="ghost" onClick={toggleMostrarContrasena} className="cursor-pointer">
                                    {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    <Field>
                        <Button variant="default" type="submit" className="py-5 font-bold text-md xl:text-lg" disabled={loading}>
                            {loading ? <><Spinner data-icon="inline-start" />Cargando...</> : <>Actualizar contraseña</>}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>

        </div>
    );
}