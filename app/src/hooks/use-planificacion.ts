"use client";

import { useState } from "react";
import planificacionesService from "@/services/planificacion_service";
import { Planificacion } from "@/DTOs/planificacion";
import { Busqueda } from "@/constants/busqueda";

export function usePlanificacion() {
    const [loading, setLoading] = useState(false);

    const registrarPlanificacion = async (planificacion: Planificacion) => {
        try {
            setLoading(true);
            const response = await planificacionesService.registrarPlanificacion(planificacion);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerPlanificaciones = async (busqueda: Busqueda) => {
        try {
            setLoading(true);
            const response = await planificacionesService.obtenerPlanificaciones(busqueda);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarPlanificacion = async (id: string, planificacion: Planificacion) => {
        try {
            setLoading(true);
            const response = await planificacionesService.actualizarPlanificacion(id, planificacion);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstadoPlanificacion = async (id: string, data: any) => {
        try {
            setLoading(true);
            const response = await planificacionesService.actualizarEstadoPlanificacion(id, data);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerPlanificacionPorId = async (id: string) => {
        try {
            setLoading(true);
            const response = await planificacionesService.obtenerPlanificacionPorId(id);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerPlanificacionVigente = async () => {
        try {
            setLoading(true);
            const response = await planificacionesService.obtenerPlanificacionVigente();
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        registrarPlanificacion,
        obtenerPlanificaciones,
        actualizarPlanificacion,
        actualizarEstadoPlanificacion,
        obtenerPlanificacionPorId,
        obtenerPlanificacionVigente
    };
}