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

function forgotPassword(correo: string) {
    const body = {
        correo: correo
    }
    return ejecutarQueryPost<Respuesta>('forgot-password', body);
}

function resetPassword(token: string, contrasena: string) {
    const body = {
        token: token,
        contrasena: contrasena
    }
    return ejecutarQueryPost<Respuesta>('reset-password', body);
}

const authService = {
    login,
    logout,
    forgotPassword,
    resetPassword
}

export default authService;