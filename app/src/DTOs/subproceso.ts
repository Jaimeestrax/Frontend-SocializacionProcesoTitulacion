import { Actividad } from "./actividad";

export type Subproceso = {
    identificador: string,
    nombre: string,
    descripcion: string,
    orden: number,
    actividades: Actividad[],
    estado?: number,
    idEncargadoGenerar?: string,
    idEncargadoActualizar?: string
}