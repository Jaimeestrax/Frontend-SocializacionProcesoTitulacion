import {
    ejecutarQueryGet,
    ejecutarQueryPost,
    ejecutarQueryPatch,
    ejecutarQueryPut
} from "../lib/api/peticiones";
import { Respuesta } from "@/constants/respuesta";


function registrarCarrera(data: any) {
    return ejecutarQueryPost<Respuesta>('registrar-carrera', data);
}

function actualizarEstadoCarrera(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>('actualizar-estado-carrera', id, data);
}

function obtenerCarreras(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-carreras', busqueda);
}

function obtenerCarreraPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-carrera-por-id', id);
}

function actualizarCarrera(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>('actualizar-carrera', id, data);
}

function obtenerCarrerasActivas() {
    return ejecutarQueryGet<Respuesta>('obtener-carreras-activas');
}

function listarCarreras() {
    return ejecutarQueryGet<Respuesta>('listar-carreras');
}

const carrerasService = {
    registrarCarrera,
    actualizarEstadoCarrera,
    obtenerCarreras,
    obtenerCarreraPorId,
    actualizarCarrera,
    obtenerCarrerasActivas,
    listarCarreras
}

export default carrerasService;