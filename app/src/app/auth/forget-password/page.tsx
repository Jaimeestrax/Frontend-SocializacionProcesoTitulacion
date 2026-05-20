"use client";

import { Mail, ShieldCheck } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast-custom";
import { Badge } from "@/components/ui/badge";

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
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

    const { forgotPassword, loading } = useAuth();
    const router = useRouter();
    const [correo, setCorreo] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await forgotPassword(correo);
            toast.success(res.message);
            setCorreo(""); // Limpiar input de correo
            router.push("/auth/sign-in");
        } catch (error: any) {
            console.error("Error al enviar correo de recuperación:", error.message);
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
                Ingrese su correo institucional para restablecer su contraseña
            </p>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="correo">CORREO ELECTRÓNICO</FieldLabel>
                        <InputGroup className='py-5 px-2'>
                            <InputGroupAddon align="inline-start">
                                <Mail />
                            </InputGroupAddon>
                            <InputGroupInput id="correo" type="email" placeholder="Ingrese su correo institucional" required
                                value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        </InputGroup>
                    </Field>
                    <Field>
                        <div className='flex flex-col gap-2'>
                            <Button variant="default" type="submit" className="py-5 font-bold text-md xl:text-lg" disabled={loading}>
                                {loading ? <><Spinner data-icon="inline-start" />Cargando...</> : <>Recuperar contraseña</>}
                            </Button>
                            <Button variant="link" type="button" className="py-5 font-bold text-md xl:text-lg border-2 border-primary"
                                onClick={() => router.push("/auth/sign-in")}>
                                Iniciar sesión
                            </Button>
                        </div>
                    </Field>
                </FieldGroup>
            </form>

            <div className="flex items-center justify-center mt-6">
                <Badge className="bg-success text-success-foreground font-bold text-xs md:text-sm">
                    <ShieldCheck data-icon="inline-start" />
                    SOLO PERSONAL AUTORIZADO
                </Badge>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 md:text-sm">
                Acceso restringido solo para la comisión de titulación. <br />
                Los intentos de recuperación de contraseña no autorizados son monitoreados y registrados.
            </p>

        </div>
    );
}