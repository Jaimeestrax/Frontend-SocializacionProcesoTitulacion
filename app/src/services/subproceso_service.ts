import {
    ejecutarQueryPost,
    ejecutarQueryGet,
    ejecutarQueryPut,
    ejecutarQueryPatch
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function registrarSubproceso(data: any) {
    return ejecutarQueryPost<Respuesta>("registrar-subproceso", data);
}

function obtenerSubprocesos(busqueda: any) {
    return ejecutarQueryPost<Respuesta>("obtener-subprocesos", busqueda);
}

function obtenerSubprocesoPorId(id: string) {
    return ejecutarQueryGet<Respuesta>("obtener-subproceso-por-id", id);
}

function actualizarSubproceso(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>("actualizar-subproceso", id, data);
}

function actualizarEstadoSubproceso(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>("actualizar-estado-subproceso", id, data);
}

function obtenerSubprocesosProximos() {
    return ejecutarQueryGet<Respuesta>("obtener-subprocesos-proximos");
}

function obtenerSubprocesoActual() {
    return ejecutarQueryGet<Respuesta>("obtener-subproceso-actual");
}

function obtenerPorcentajeAvance() {
    return ejecutarQueryGet<Respuesta>("obtener-porcentaje-avance");
}

const subprocesosService = {
    registrarSubproceso,
    obtenerSubprocesos,
    obtenerSubprocesoPorId,
    actualizarSubproceso,
    actualizarEstadoSubproceso,
    obtenerSubprocesosProximos,
    obtenerSubprocesoActual,
    obtenerPorcentajeAvance
}

export default subprocesosService;