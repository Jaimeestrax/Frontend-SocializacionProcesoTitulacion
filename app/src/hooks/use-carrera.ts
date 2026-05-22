"use client";

import { useState } from "react";
import carrerasService from "@/services/carreras_service";
import { Carrera } from "@/DTOs/carrera";
import { Busqueda } from "@/constants/busqueda";

export function useCarreras() {
    const [loading, setLoading] = useState(false);

    const registrarCarrera = async (carrera: Carrera) => {
        try {
            setLoading(true);

            const res = await carrerasService.registrarCarrera(carrera);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstadoCarrera = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await carrerasService.actualizarEstadoCarrera(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerCarreras = async (busqueda: Busqueda) => {
        try {
            setLoading(true);

            const res = await carrerasService.obtenerCarreras(busqueda);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerCarreraPorId = async (id: string) => {
        try {
            setLoading(true);

            const res = await carrerasService.obtenerCarreraPorId(id);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarCarrera = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await carrerasService.actualizarCarrera(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerCarrerasActivas = async () => {
        try {
            setLoading(true);

            const res = await carrerasService.obtenerCarrerasActivas();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listarCarreras = async () => {
        try {
            setLoading(true);

            const res = await carrerasService.listarCarreras();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        registrarCarrera,
        actualizarEstadoCarrera,
        obtenerCarreras,
        obtenerCarreraPorId,
        actualizarCarrera,
        obtenerCarrerasActivas,
        listarCarreras,
        loading
    };
}