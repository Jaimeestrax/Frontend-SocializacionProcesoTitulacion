import { ejecutarQueryGet } from "../lib/api/peticiones";
import { Respuesta } from "@/interfaces/respuesta";

function listarCargos() {
    return ejecutarQueryGet<Respuesta>('listar-cargos');
}

const cargosService = {
    listarCargos
}

export default cargosService;