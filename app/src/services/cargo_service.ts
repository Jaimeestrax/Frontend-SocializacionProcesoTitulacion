import {
    ejecutarQueryGet,
    ejecutarQueryPost,
    ejecutarQueryPatch,
    ejecutarQueryPut
} from "../lib/api/peticiones";
import { Respuesta } from "@/constants/respuesta";

function registrarCargo(data: any) {
    return ejecutarQueryPost<Respuesta>('registrar-cargo', data);
}

function actualizarEstadoCargo(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>('actualizar-estado-cargo', id, data);
}

function obtenerCargos(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-cargos', busqueda);
}

function listarCargos() {
    return ejecutarQueryGet<Respuesta>('listar-cargos');
}

function obtenerCargoPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-cargo-por-id', id);
}

function actualizarCargo(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>('actualizar-cargo', id, data);
}

function obtenerCargosActivos() {
    return ejecutarQueryGet<Respuesta>('obtener-cargos-activos');
}

const cargosService = {
    registrarCargo,
    actualizarEstadoCargo,
    obtenerCargos,
    listarCargos,
    obtenerCargoPorId,
    actualizarCargo,
    obtenerCargosActivos
}

export default cargosService;