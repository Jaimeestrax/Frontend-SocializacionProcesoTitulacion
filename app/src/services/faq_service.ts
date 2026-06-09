import {
    ejecutarQueryPost,
    ejecutarQueryGet,
    ejecutarQueryPut,
    ejecutarQueryDelete
} from "../lib/api/peticiones";

import { Respuesta } from "@/constants/respuesta";

function registrarFaq(data: any) {
    return ejecutarQueryPost<Respuesta>('registrar-faq', data);
}

function obtenerFaqs(busqueda: any) {
    return ejecutarQueryPost<Respuesta>('obtener-faqs', busqueda);
}

function obtenerFaqPorId(id: string) {
    return ejecutarQueryGet<Respuesta>('obtener-faq-por-id', id);
}

function actualizarFaq(id: string, data: any) {
    return ejecutarQueryPut<Respuesta>('actualizar-faq', id, data);
}

function eliminarFaq(id: string) {
    return ejecutarQueryDelete<Respuesta>('eliminar-faq', id);
}

const faqService = {
    registrarFaq,
    obtenerFaqs,
    obtenerFaqPorId,
    actualizarFaq,
    eliminarFaq
}

export default faqService;
