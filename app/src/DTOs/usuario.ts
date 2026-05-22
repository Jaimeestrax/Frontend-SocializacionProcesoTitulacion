export type Usuario = {
    nombres: string,
    apellidos: string,
    correo: string,
    usuario?: string,
    contrasena?: string,
    foto?: File,
    idRol?: string,
    idCargo?: string,
    idCarrera?: string
}