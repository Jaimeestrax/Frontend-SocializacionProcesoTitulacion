"use client";

import { useState } from "react";
import instrumentosService from "@/services/instrumento_service";
import { Instrumento } from "@/DTOs/instrumento";
import { Busqueda } from "@/constants/busqueda";

export function useInstrumentos() {
    const [loading, setLoading] = useState(false);

    // Función de registro instrumentos
    const registrarInstrumento = async (instrumento: Instrumento) => {
        try {
            setLoading(true); // Activa loading

            const res = await instrumentosService.registrarInstrumento(instrumento); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de obtención
    const obtenerInstrumentos = async (busqueda: Busqueda) => {
        try {
            setLoading(true); // Activa loading

            const res = await instrumentosService.obtenerInstrumentos(busqueda); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de cambio de estado
    const actualizarEstadoInstrumento = async (id: string, data: any) => {
        try {
            setLoading(true); // Activa loading

            const res = await instrumentosService.actualizarEstadoInstrumento(id, data); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Función de actualización
    const actualizarInstrumento = async (id: string, data: any) => {
        try {
            setLoading(true); // Activa loading

            const res = await instrumentosService.actualizarInstrumento(id, data); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    const obtenerInstrumentoPorId = async (id: string) => {
        try {
            setLoading(true); // Activa loading

            const res = await instrumentosService.obtenerInstrumentoPorId(id); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    const listarInstrumentos = async () => {
        try {
            setLoading(true); // Activa loading

            const res = await instrumentosService.listarInstrumentos(); // Llama al servicio

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false); // Desactiva loading
        }
    };

    // Hook que retorna funciones crud de instrumentos
    return {
        registrarInstrumento,
        obtenerInstrumentos,
        actualizarEstadoInstrumento,
        actualizarInstrumento,
        obtenerInstrumentoPorId,
        listarInstrumentos,
        loading
    };
}