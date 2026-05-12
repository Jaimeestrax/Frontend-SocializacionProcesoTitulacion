export type InstrumentoSnapshot = {
    idInstrumento: string;
    identificador: string;
}

export type ActividadSnapshot = {
    _id?: string;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    idParticipante: string;
    nombreParticipante?: string;
    instrumentos: InstrumentoSnapshot[];
}

export type SubprocesoSnapshot = {
    _id?: string;
    identificador: string;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    actividades: ActividadSnapshot[];
}

export type Planificacion = {
    periodo: string;
    fechaInicio: string;
    fechaFin: string;
    subprocesos: SubprocesoSnapshot[];
    idEncargadoGenerar?: string;
    idEncargadoActualizar?: string;
}