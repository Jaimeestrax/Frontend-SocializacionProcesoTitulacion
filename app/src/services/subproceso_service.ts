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

function actualizarSubproceso(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>("actualizar-subproceso", id, data);
}

function actualizarEstadoSubproceso(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>("actualizar-estado-subproceso", id, data);
}

function obtenerSubprocesoPorId(id: string) {
    return ejecutarQueryGet<Respuesta>("obtener-subproceso-por-id", id);
}

function contarSubprocesosActivos() {
    return ejecutarQueryGet<Respuesta>("contar-subprocesos-activos");
}

function listarSubprocesosActivos() {
    return ejecutarQueryGet<Respuesta>("listar-subprocesos-activos");
}

const subprocesosService = {
    registrarSubproceso,
    obtenerSubprocesos,
    actualizarSubproceso,
    actualizarEstadoSubproceso,
    obtenerSubprocesoPorId,
    contarSubprocesosActivos,
    listarSubprocesosActivos
}

export default subprocesosService;