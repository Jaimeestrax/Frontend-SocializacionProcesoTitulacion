import { ejecutarQueryGet, ejecutarQueryPost } from "../lib/api/peticiones";
import { Respuesta } from "@/interfaces/respuesta";

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

function obtenerUsuarioAutenticado() {
    return ejecutarQueryGet<Respuesta>('obtener-usuario-autenticado');
}

const authService = {
    login,
    logout,
    obtenerUsuarioAutenticado
}

export default authService;