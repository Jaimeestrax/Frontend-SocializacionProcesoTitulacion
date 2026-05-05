import {
    ejecutarQueryPost,
    ejecutarQueryGet,
    ejecutarQueryPatch,
    ejecutarQueryPut
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function registrarRol(data: any) {
    return ejecutarQueryPost<Respuesta>('registrar-rol', data);
}

function actualizarEstadoRol(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>('actualizar-estado-rol', id, data);
}

function obtenerRoles(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-roles', busqueda);
}

function actualizarRol(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>('actualizar-rol', id, data);
}

function obtenerRolPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-rol-por-id', id);
}

function obtenerRolesActivos() {
    return ejecutarQueryGet<Respuesta>('obtener-roles-activos');
}

const rolesService = {
    registrarRol,
    actualizarEstadoRol,
    obtenerRoles,
    actualizarRol,
    obtenerRolPorId,
    obtenerRolesActivos
}

export default rolesService;