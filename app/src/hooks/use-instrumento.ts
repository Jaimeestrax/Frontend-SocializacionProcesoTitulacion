"use client";

import { useState } from "react";
import instrumentosService from "@/services/instrumentos_service";
import { Instrumento } from "@/DTOs/instrumento";
import { Busqueda } from "@/interfaces/busqueda";

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

    // Hook que retorna funciones crud de instrumentos
    return {
        registrarInstrumento,
        obtenerInstrumentos,
        loading
    };
}