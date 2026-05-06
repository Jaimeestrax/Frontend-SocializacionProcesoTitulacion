"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

import { User, LockKeyhole, LogIn, EyeOffIcon, EyeIcon } from 'lucide-react';

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

import { useRouter } from "next/navigation";

export default function FormLogin() {
    const { login, loading } = useAuth();
    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");

    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const toggleMostrarContrasena = () => {
        setMostrarContrasena(!mostrarContrasena);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                    <InputGroup className='py-5 px-2'>
                        <InputGroupAddon align="inline-start">
                            <User />
                        </InputGroupAddon>
                        <InputGroupInput id="usuario" type="text" placeholder="Ingrese su nombre de usuario" required
                            value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                    </InputGroup>
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">CONTRASEÑA</FieldLabel>
                        <a
                            href="#"
                            className="text-primary ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                            OLVIDO SU CONTRASEÑA?
                        </a>
                    </div>
                    <InputGroup className='py-5 px-2'>
                        <InputGroupAddon align="inline-start">
                            <LockKeyhole />
                        </InputGroupAddon>
                        <InputGroupInput id="password" type={mostrarContrasena ? "text" : "password"} required
                            value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
                        <InputGroupAddon align="inline-end">
                            <Button type="button" variant="ghost" onClick={toggleMostrarContrasena} className="cursor-pointer">
                                {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
                <Field>
                    <Button variant="default" type="submit" className="py-5 font-bold text-md xl:text-lg" disabled={loading}>
                        {loading ? <><Spinner data-icon="inline-start" />Cargando...</> : <>Iniciar <LogIn /></>}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}