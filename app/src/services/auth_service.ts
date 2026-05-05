import { ejecutarQueryGet, ejecutarQueryPost } from "../lib/api/peticiones";
import { Respuesta } from "@/constants/respuesta";

function login(usuario: string, contrasena: string) {
    const body = {
        usuario: usuario,
        contrasena: contrasena
    }
    return ejecutarQueryPost<Respuesta>('login', body);
}

function logout() {
    return ejecutarQueryPost<Respuesta>('logout', {});
}

const authService = {
    login,
    logout
}

export default authService;