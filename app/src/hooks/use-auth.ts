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
            const identity = res.data; // Respuesta de api

            // Guardar usuario
            localStorage.setItem("identity", JSON.stringify(identity));
            // Cookies ya vienen del backend


            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de cierre de sesión
    const logout = async () => {
        try {
            setLoading(true); // Activa loading

            const res = await authService.logout(); // Llama al servicio que elimina cookie
            // Limpiar identity
            localStorage.removeItem("identity");
            // Redirigir a login
            router.push("/");

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función para recuperar contraseña
    const forgotPassword = async (correo: string) => {
        try {
            setLoading(true);
            const res = await authService.forgotPassword(correo);
            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Función de reseteo de contraseña
    const resetPassword = async (token: string, contrasena: string) => {
        try {
            setLoading(true);
            const res = await authService.resetPassword(token, contrasena);
            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Hook que retorna login, logout y loading
    return {
        login,
        logout,
        forgotPassword,
        resetPassword,
        loading
    };
}