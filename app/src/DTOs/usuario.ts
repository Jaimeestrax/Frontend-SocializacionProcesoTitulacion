export type Usuario = {
    nombres: string,
    apellidos: string,
    correo: string,
    usuario: string,
    contrasena: string,
    foto?: string,
    idRol: string,
    idCargo: string,
    descripcion?: string,
    fechaFin?: Date
}