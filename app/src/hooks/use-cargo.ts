"use client";

import { useState } from "react";
import cargosService from "@/services/cargo_service";
import { Cargo } from "@/DTOs/cargo";
import { Busqueda } from "@/constants/busqueda";

export function useCargos() {
    const [loading, setLoading] = useState(false);

    const registrarCargo = async (cargo: Cargo) => {
        try {
            setLoading(true);

            const res = await cargosService.registrarCargo(cargo);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstadoCargo = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await cargosService.actualizarEstadoCargo(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerCargos = async (busqueda: Busqueda) => {
        try {
            setLoading(true);

            const res = await cargosService.obtenerCargos(busqueda);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

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

    const obtenerCargoPorId = async (id: string) => {
        try {
            setLoading(true);

            const res = await cargosService.obtenerCargoPorId(id);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarCargo = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await cargosService.actualizarCargo(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerCargosActivos = async () => {
        try {
            setLoading(true);

            const res = await cargosService.obtenerCargosActivos();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        registrarCargo,
        actualizarEstadoCargo,
        obtenerCargos,
        listarCargos,
        obtenerCargoPorId,
        actualizarCargo,
        obtenerCargosActivos,
        loading
    };
}