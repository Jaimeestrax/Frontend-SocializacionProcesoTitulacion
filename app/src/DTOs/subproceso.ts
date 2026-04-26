import { Actividad } from "./actividad";

export type Subproceso = {
    identificador: string,
    nombre: string,
    descripcion: string,
    fecha_inicio: string,
    fecha_fin: string,
    actividades: Actividad[]
}