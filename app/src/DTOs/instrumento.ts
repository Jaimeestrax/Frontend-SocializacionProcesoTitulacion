export type Instrumento = {
    identificador?: string,
    codigo?: string,
    nombre: string,
    descripcion?: string,
    archivo?: File | string,
    idEncargadoGenerar?: string,
    idEncargadoActualizar?: string
}