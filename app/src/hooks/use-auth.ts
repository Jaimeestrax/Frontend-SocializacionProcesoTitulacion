"use client";

import { useState } from "react";
import authService from "@/services/auth_service";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/use-auth-context";

export function useAuth() {
    const router = useRouter();
    // Contexto de la sesión
    const { setSession, clearSession } = useAuthContext();
    // Estado para controlar loading
    const [loading, setLoading] = useState(false);

    // Función de inicio de sesión
    const login = async (usuario: string, contrasena: string) => {
        try {
            setLoading(true); // Activa loading

            const res = await authService.login(usuario, contrasena); // Llama al servicio
            const { token, publicUser } = res.data; // Respuesta de api

            setSession(publicUser, token); // Guardar usuario Y token en contexto

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de cierre de sesión
    const logout = () => {
        clearSession(); // Limpia sesión
        router.push("/home");
    };

    // Hook que retorna login, logout y loading
    return {
        login,
        logout,
        loading
    };
}