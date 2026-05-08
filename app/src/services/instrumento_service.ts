import {
    ejecutarQueryPost,
    ejecutarQueryPostArchivos,
    ejecutarQueryGet,
    ejecutarQueryPutArchivos,
    ejecutarQueryPatch
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

// Envio de form-data para registrar un instumento (metadata y archivo)
function registrarInstrumento(data: any) {
    const formData = new FormData();

    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("archivo", data.archivo);
    formData.append("idEncargadoGenerar", data.idEncargadoGenerar);

    return ejecutarQueryPostArchivos<Respuesta>('registrar-instrumento', formData);
}

function obtenerInstrumentos(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-instrumentos', busqueda);
}

function obtenerInstrumentoPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-instrumento-por-id', id);
}

function actualizarInstrumento(id: string, data: any) {
    const formData = new FormData();

    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("idEncargadoActualizar", data.idEncargadoActualizar);
    if (data.archivo) {
        formData.append("archivo", data.archivo);
    }
    return ejecutarQueryPutArchivos<Respuesta>('actualizar-instrumento', id, formData);
}

function actualizarVigenciaInstrumento(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>('actualizar-vigencia-instrumento', id, data);
}

function listarInstrumentos() {
    return ejecutarQueryGet<Respuesta>('listar-instrumentos');
}

function obtenerHistoricoInstrumento(codigo: string) {
    return ejecutarQueryGet<Respuesta>('obtener-historico-instrumento', codigo);
}

function contarInstrumentosVigentes() {
    return ejecutarQueryGet<Respuesta>('contar-instrumentos-vigentes');
}

const instrumentosService = {
    registrarInstrumento,
    obtenerInstrumentos,
    obtenerInstrumentoPorId,
    actualizarInstrumento,
    actualizarVigenciaInstrumento,
    listarInstrumentos,
    obtenerHistoricoInstrumento,
    contarInstrumentosVigentes
}

export default instrumentosService;