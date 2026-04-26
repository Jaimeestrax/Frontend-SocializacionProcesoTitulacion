"use client";

import { useState } from "react";
import { login as loginService } from "@/services/auth_service";

export function useAuth() {
    // Estado para controlar loading
    const [loading, setLoading] = useState(false);

    // Función de inicio de sesión
    const login = async (usuario: string, contrasena: string) => {
        try {
            setLoading(true); // Activa loading

            const res = await loginService(usuario, contrasena); // Llama al servicio

            localStorage.setItem("token", res.data.token); // Guarda token

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de cierre de sesión
    const logout = () => {
        // Elimina el token del localStorage
        localStorage.removeItem("token");
    };

    // Hook que retorna login, logout y loading
    return {
        login,
        logout,
        loading
    };
}