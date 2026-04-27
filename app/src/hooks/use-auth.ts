"use client";

import { useState } from "react";
import authService from "@/services/auth_service";
import { useRouter } from "next/navigation";

export function useAuth() {
    const router = useRouter();
    // Estado para controlar loading
    const [loading, setLoading] = useState(false);

    // Función de inicio de sesión
    const login = async (usuario: string, contrasena: string) => {
        try {
            setLoading(true); // Activa loading

            const res = await authService.login(usuario, contrasena); // Llama al servicio
            const { token, publicUser } = res.data; // Respuesta de api

            // Guardar usuario Y token en localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("identity", JSON.stringify(publicUser));

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de cierre de sesión
    const logout = () => {
        // Limpiar localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("identity");
        router.push("/home");
    };

    // Hook que retorna login, logout y loading
    return {
        login,
        logout,
        loading
    };
}