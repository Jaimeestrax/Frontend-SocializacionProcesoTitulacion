import { ejecutarQueryPost } from "../lib/api/peticiones";
import { Respuesta } from "@/interfaces/respuesta";

export function login(usuario: string, contrasena: string) {
    const body = {
        usuario: usuario,
        contrasena: contrasena
    }
    return ejecutarQueryPost<Respuesta>('login', body);
}