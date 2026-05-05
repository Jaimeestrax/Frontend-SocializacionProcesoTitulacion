"use client";

import { useState } from "react";
import subprocesosService from "@/services/subproceso_service";
import { Subproceso } from "@/DTOs/subproceso";
import { Busqueda } from "@/constants/busqueda";

export function useSubprocesos() {
    const [loading, setLoading] = useState(false);

    const registrarSubproceso = async (subproceso: Subproceso) => {
        try {
            setLoading(true);
            const response = await subprocesosService.registrarSubproceso(subproceso);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerSubprocesos = async (busqueda: any) => {
        try {
            setLoading(true);
            const response = await subprocesosService.obtenerSubprocesos(busqueda);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerSubprocesoPorId = async (id: string) => {
        try {
            setLoading(true);
            const response = await subprocesosService.obtenerSubprocesoPorId(id);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarSubproceso = async (id: string, subproceso: Subproceso) => {
        try {
            setLoading(true);
            const response = await subprocesosService.actualizarSubproceso(id, subproceso);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstadoSubproceso = async (id: string, data: any) => {
        try {
            setLoading(true);
            const response = await subprocesosService.actualizarEstadoSubproceso(id, data);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerSubprocesosProximos = async () => {
        try {
            setLoading(true);
            const response = await subprocesosService.obtenerSubprocesosProximos();
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerSubprocesoActual = async () => {
        try {
            setLoading(true);
            const response = await subprocesosService.obtenerSubprocesoActual();
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerPorcentajeAvance = async () => {
        try {
            setLoading(true);
            const response = await subprocesosService.obtenerPorcentajeAvance();
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        registrarSubproceso,
        obtenerSubprocesos,
        obtenerSubprocesoPorId,
        actualizarSubproceso,
        actualizarEstadoSubproceso,
        obtenerSubprocesosProximos,
        obtenerSubprocesoActual,
        obtenerPorcentajeAvance
    };
}