import {
    ejecutarQueryPost,
    ejecutarQueryPostArchivos,
    ejecutarQueryGet,
    ejecutarQueryPutArchivos,
    ejecutarQueryPatch
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function registrarPlanificacion(data: any) {
    const formData = new FormData();

    formData.append("periodo", data.periodo);
    formData.append("fechaInicio", data.fechaInicio);
    formData.append("fechaFin", data.fechaFin);
    formData.append("subprocesos", JSON.stringify(data.subprocesos));
    formData.append("imagenProceso", data.imagenProceso);
    formData.append("idEncargadoGenerar", data.idEncargadoGenerar);

    return ejecutarQueryPostArchivos<Respuesta>("registrar-planificacion", formData);
}

function obtenerPlanificaciones(busqueda: any) {
    return ejecutarQueryPost<Respuesta>("obtener-planificaciones", busqueda);
}

function actualizarPlanificacion(id: string, data: any) {
    const formData = new FormData();

    formData.append("periodo", data.periodo);
    formData.append("fechaInicio", data.fechaInicio);
    formData.append("fechaFin", data.fechaFin);
    formData.append("subprocesos", JSON.stringify(data.subprocesos));
    formData.append("idEncargadoActualizar", data.idEncargadoActualizar);
    if (data.imagenProceso) {
        formData.append("imagenProceso", data.imagenProceso);
    }
    return ejecutarQueryPutArchivos<Respuesta>("actualizar-planificacion", id, formData);
}

function actualizarEstadoPlanificacion(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>("actualizar-estado-planificacion", id, data);
}

function obtenerPlanificacionPorId(id: string) {
    return ejecutarQueryGet<Respuesta>("obtener-planificacion-por-id", id);
}

function contarPlanificacionesTotales() {
    return ejecutarQueryGet<Respuesta>("contar-planificaciones-totales");
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
    contarPlanificacionesTotales,

    // Funciones públicas
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
