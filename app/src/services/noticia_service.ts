import {
    ejecutarQueryPost,
    ejecutarQueryPostArchivos,
    ejecutarQueryGet,
    ejecutarQueryPutArchivos,
    ejecutarQueryPatch,
    ejecutarQueryDelete
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function registrarNoticia(data: any) {
    const formData = new FormData();

    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    formData.append("prioridad", data.prioridad);
    formData.append("idPlanificacion", data.idPlanificacion);
    formData.append("idEncargadoGenerar", data.idEncargadoGenerar);
    if (data.imagen) {
        formData.append("imagen", data.imagen);
    }
    return ejecutarQueryPostArchivos<Respuesta>('registrar-noticia', formData);
}

function obtenerNoticias(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-noticias', busqueda);
}

function obtenerNoticiaPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-noticia-por-id', id);
}

function actualizarNoticia(id: string, data: any) {
    const formData = new FormData();

    formData.append("titulo", data.titulo);
    formData.append("descripcion", data.descripcion);
    formData.append("prioridad", data.prioridad);
    formData.append("idPlanificacion", data.idPlanificacion);
    formData.append("idEncargadoActualizar", data.idEncargadoActualizar);
    if (data.imagen) {
        formData.append("imagen", data.imagen);
    }
    return ejecutarQueryPutArchivos<Respuesta>('actualizar-noticia', id, formData);
}

function eliminarNoticia(id: string) {
    return ejecutarQueryDelete<Respuesta>('eliminar-noticia', id);
}

function obtenerNoticiasPublico() {
    return ejecutarQueryGet<Respuesta>('obtener-noticias-publico');
}

const noticiaService = {
    registrarNoticia,
    obtenerNoticias,
    obtenerNoticiaPorId,
    actualizarNoticia,
    eliminarNoticia,
    obtenerNoticiasPublico
}

export default noticiaService;
