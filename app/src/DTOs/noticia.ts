export type Noticia = {
    titulo: string,
    descripcion: string,
    prioridad: string,
    idPlanificacion?: string,
    imagen?: File | string,
    idEncargadoGenerar?: string,
    idEncargadoActualizar?: string,
}