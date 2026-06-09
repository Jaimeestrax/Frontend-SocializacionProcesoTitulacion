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

// Funciones públicas
function obtenerPlanificacionVigente() {
    return ejecutarQueryGet<Respuesta>("obtener-planificacion-vigente");
}

function obtenerPeriodoActual() {
    return ejecutarQueryGet<Respuesta>("obtener-periodo-actual");
}

function obtenerPorcentajeAvance() {
    return ejecutarQueryGet<Respuesta>("obtener-porcentaje-avance");
}

function obtenerProximasActividades() {
    return ejecutarQueryGet<Respuesta>("obtener-proximas-actividades");
}

function obtenerSubprocesoActual() {
    return ejecutarQueryGet<Respuesta>("obtener-subproceso-actual");
}

function obtenerActividadPorId(id: string) {
    return ejecutarQueryGet<Respuesta>("obtener-actividad-por-id", id);
}

function obtenerSubprocesosPlanificacionVigente() {
    return ejecutarQueryGet<Respuesta>("obtener-subprocesos-planificacion-vigente");
}

function obtenerCodigoPAO() {
    return ejecutarQueryGet<Respuesta>("obtener-codigo-pao");
}

function obtenerSubprocesoEspecificoPlanificacion(id: string) {
    return ejecutarQueryGet<Respuesta>("obtener-subproceso-especifico-planificacion", id);
}

const planificacionesService = {
    registrarPlanificacion,
    obtenerPlanificaciones,
    actualizarPlanificacion,
    actualizarEstadoPlanificacion,
    obtenerPlanificacionPorId,
    obtenerPlanificacionVigente,
    obtenerPeriodoActual,
    obtenerPorcentajeAvance,
    obtenerProximasActividades,
    obtenerSubprocesoActual,
    obtenerActividadPorId,
    obtenerSubprocesosPlanificacionVigente,
    obtenerCodigoPAO,
    obtenerSubprocesoEspecificoPlanificacion
}

export default planificacionesService;
