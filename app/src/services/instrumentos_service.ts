import {
    ejecutarQueryPost,
    ejecutarQueryPostArchivos,
    ejecutarQueryGet,
    ejecutarQueryPutArchivos,
    ejecutarQueryPatch
} from "../lib/api/peticiones";

import { Respuesta } from "@/interfaces/respuesta";

// Envio de form-data para registrar un instumento (metadata y archivo)
function registrarInstrumento(data: any) {
    const formData = new FormData();

    formData.append("identificador", data.identificador);
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    formData.append("id_encargado", data.id_encargado);
    formData.append("archivo", data.archivo);

    return ejecutarQueryPostArchivos<Respuesta>('registrar-instrumento', formData);
}

// Envia paginación
function obtenerInstrumentos(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-instrumentos', busqueda);
}

function obtenerInstrumentoPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-instrumento-por-id', id);
}

function actualizarInstrumento(id: string, data: any) {
    const formData = new FormData();

    formData.append("identificador", data.identificador);
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion);
    if (data.archivo) {
        formData.append("archivo", data.archivo);
    }
    return ejecutarQueryPutArchivos<Respuesta>('actualizar-instrumento', id, formData);
}

function actualizarEstadoInstrumento(id: string, data: any) {
    return ejecutarQueryPatch<Respuesta>('actualizar-estado-instrumento', id, data);
}

const instrumentosService = {
    registrarInstrumento,
    obtenerInstrumentos,
    obtenerInstrumentoPorId,
    actualizarInstrumento,
    actualizarEstadoInstrumento
}

export default instrumentosService;