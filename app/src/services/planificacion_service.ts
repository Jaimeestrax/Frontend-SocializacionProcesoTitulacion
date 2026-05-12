import {
    ejecutarQueryPost,
    ejecutarQueryGet,
    ejecutarQueryPut,
    ejecutarQueryPatch
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function registrarPlanificacion(data: any) {
    return ejecutarQueryPost<Respuesta>("registrar-planificacion", data);
}

function obtenerPlanificaciones(busqueda: any) {
    return ejecutarQueryPost<Respuesta>("obtener-planificaciones", busqueda);
}

function actualizarPlanificacion(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>("actualizar-planificacion", id, data);
}

function actualizarEstadoPlanificacion(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>("actualizar-estado-planificacion", id, data);
}

function obtenerPlanificacionPorId(id: string) {
    return ejecutarQueryGet<Respuesta>("obtener-planificacion-por-id", id);
}

function obtenerPlanificacionVigente() {
    return ejecutarQueryGet<Respuesta>("obtener-planificacion-vigente");
}

const planificacionesService = {
    registrarPlanificacion,
    obtenerPlanificaciones,
    actualizarPlanificacion,
    actualizarEstadoPlanificacion,
    obtenerPlanificacionPorId,
    obtenerPlanificacionVigente
}

export default planificacionesService;
