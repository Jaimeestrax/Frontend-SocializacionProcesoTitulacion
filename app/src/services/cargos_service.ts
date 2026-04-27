import { ejecutarQueryGet } from "../lib/api/peticiones";
import { Respuesta } from "@/interfaces/respuesta";

function obtenerCargos() {
    return ejecutarQueryGet<Respuesta>('obtener-cargos');
}

const cargosService = {
    obtenerCargos
}

export default cargosService;