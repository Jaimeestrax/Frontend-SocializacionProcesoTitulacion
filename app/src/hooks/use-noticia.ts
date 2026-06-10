"use client";

import { useState } from "react";
import noticiaService from "@/services/noticia_service";
import { Noticia } from "@/DTOs/noticia";
import { Busqueda } from "@/constants/busqueda";

export function useNoticias() {
    const [loading, setLoading] = useState(false);

    // Función de registro
    const registrarNoticia = async (noticia: Noticia) => {
        try {
            setLoading(true); // Activa loading

            const res = await noticiaService.registrarNoticia(noticia); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de obtención
    const obtenerNoticias = async (busqueda: Busqueda) => {
        try {
            setLoading(true); // Activa loading

            const res = await noticiaService.obtenerNoticias(busqueda); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de actualización
    const actualizarNoticia = async (id: string, data: any) => {
        try {
            setLoading(true); // Activa loading

            const res = await noticiaService.actualizarNoticia(id, data); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    const obtenerNoticiaPorId = async (id: string) => {
        try {
            setLoading(true); // Activa loading

            const res = await noticiaService.obtenerNoticiaPorId(id); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    const eliminarNoticia = async (id: string) => {
        try {
            setLoading(true); // Activa loading

            const res = await noticiaService.eliminarNoticia(id); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    const obtenerNoticiasPublico = async () => {
        try {
            setLoading(true); // Activa loading

            const res = await noticiaService.obtenerNoticiasPublico(); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Hook que retorna funciones crud de noticias
    return {
        registrarNoticia,
        obtenerNoticias,
        actualizarNoticia,
        obtenerNoticiaPorId,
        eliminarNoticia,
        obtenerNoticiasPublico,
        loading
    };
}
