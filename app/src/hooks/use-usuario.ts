"use client";

import { useState } from "react";
import usuarioService from "@/services/usuario_service";
import { Usuario } from "@/DTOs/usuario";
import { Busqueda } from "@/constants/busqueda";

export function useUsuarios() {
    const [loading, setLoading] = useState(false);

    const obtenerUsuarioAutenticado = async () => {
        try {
            setLoading(true);

            const res = await usuarioService.obtenerUsuarioAutenticado();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const registrarUsuario = async (usuario: Usuario) => {
        try {
            setLoading(true);

            const res = await usuarioService.registrarUsuario(usuario);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarUsuario = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await usuarioService.actualizarUsuario(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstadoUsuario = async (id: string, data: any) => {
        try {
            setLoading(true);

            const res = await usuarioService.actualizarEstadoUsuario(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerUsuarios = async (busqueda: any) => {
        try {
            setLoading(true);

            const res = await usuarioService.obtenerUsuarios(busqueda);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerUsuarioPorId = async (id: string) => {
        try {
            setLoading(true);

            const res = await usuarioService.obtenerUsuarioPorId(id);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const contarUsuariosActivos = async () => {
        try {
            setLoading(true);

            const res = await usuarioService.contarUsuariosActivos();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        obtenerUsuarioAutenticado,
        registrarUsuario,
        actualizarUsuario,
        actualizarEstadoUsuario,
        obtenerUsuarios,
        obtenerUsuarioPorId,
        contarUsuariosActivos,
        loading
    };
}