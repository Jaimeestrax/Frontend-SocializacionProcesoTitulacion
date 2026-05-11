import { Actividad } from "./actividad";

export type Subproceso = {
    identificador: string,
    nombre: string,
    descripcion: string,
    actividades: Actividad[],
    estado?: number,
    idEncargadoGenerar?: string,
    idEncargadoActualizar?: string
}