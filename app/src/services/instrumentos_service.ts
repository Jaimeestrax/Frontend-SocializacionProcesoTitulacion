import { ejecutarQueryPost, ejecutarQueryPostArchivos } from "../lib/api/peticiones";
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

const instrumentosService = {
    registrarInstrumento,
    obtenerInstrumentos
}

export default instrumentosService;