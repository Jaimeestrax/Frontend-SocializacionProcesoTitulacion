import { ejecutarQueryPost } from "../lib/api/peticiones";
import { Respuesta } from "@/constants/respuesta";

function procesarMensajeUsuario(data: any) {
    return ejecutarQueryPost<Respuesta>(`procesar-mensaje-usuario`, data);
}

const chatbotService = {
    procesarMensajeUsuario
}

export default chatbotService;