import {
    ejecutarQueryGet,
    ejecutarQueryPost,
    ejecutarQueryPutArchivos,
    ejecutarQueryPatch
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function obtenerUsuarioAutenticado() {
    return ejecutarQueryGet<Respuesta>('obtener-usuario-autenticado');
}

function registrarUsuario(data: any) {
    return ejecutarQueryPost<Respuesta>('registrar-usuario', data);
}

function actualizarUsuario(id: string, data: any) {
    const formData = new FormData();
    formData.append("nombres", data.nombres);
    formData.append("apellidos", data.apellidos);
    formData.append("correo", data.correo);

    // Estos campos pueden o no ser actualizados
    if (data.usuario) {
        formData.append("usuario", data.usuario);
    }

    if (data.idRol) {
        formData.append("idRol", data.idRol);
    }

    if (data.idCargo) {
        formData.append("idCargo", data.idCargo);
    }

    if (data.contrasena) {
        formData.append("contrasena", data.contrasena);
    }

    if (data.foto) {
        formData.append("foto", data.foto);
    }
    return ejecutarQueryPutArchivos<Respuesta>('actualizar-usuario', id, formData);
}

function actualizarEstadoUsuario(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>('actualizar-estado-usuario', id, data);
}

function obtenerUsuarios(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-usuarios', busqueda);
}

function obtenerUsuarioPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-usuario-por-id', id);
}

const usuarioService = {
    obtenerUsuarioAutenticado,
    registrarUsuario,
    actualizarUsuario,
    actualizarEstadoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId
}

export default usuarioService;