"use client";

import { useState } from "react";
import cargosService from "@/services/cargos_service";


export function useCargos() {
    const [loading, setLoading] = useState(false);

    // Función de listado de cargos
    const listarCargos = async () => {
        try {
            setLoading(true);

            const res = await cargosService.listarCargos();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        listarCargos,
        loading
    };
}