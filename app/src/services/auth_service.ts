import { ejecutarQueryGet } from "../lib/api/peticiones";
import { Respuesta } from "@/interfaces/respuesta";

export function obtenerProductos() {
    return ejecutarQueryGet<Respuesta>('obtenerProductos');
}