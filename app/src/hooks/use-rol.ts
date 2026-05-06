"use client";

import { useState } from "react";
import rolesService from "@/services/rol_service";
import { Rol } from "@/DTOs/rol";
import { Busqueda } from "@/constants/busqueda";

export function useRoles() {
    const [loading, setLoading] = useState(false);

    const registrarRol = async (rol: Rol) => {
        try {
            setLoading(true);

            const res = await rolesService.registrarRol(rol);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstadoRol = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await rolesService.actualizarEstadoRol(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerRoles = async (busqueda: Busqueda) => {
        try {
            setLoading(true);

            const res = await rolesService.obtenerRoles(busqueda);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarRol = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await rolesService.actualizarRol(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerRolPorId = async (id: string) => {
        try {
            setLoading(true);

            const res = await rolesService.obtenerRolPorId(id);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const contarRolesActivos = async () => {
        try {
            setLoading(true);

            const res = await rolesService.contarRolesActivos();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listarRoles = async () => {
        try {
            setLoading(true);

            const res = await rolesService.listarRoles();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        registrarRol,
        actualizarEstadoRol,
        obtenerRoles,
        actualizarRol,
        obtenerRolPorId,
        contarRolesActivos,
        listarRoles,
        loading
    };
}
