import { environment } from "./client";
import { getHeadersJson, getHeadersArchivos } from "./headers";

// GET -> Obtiene datos
export async function ejecutarQueryGet<T>(url: string): Promise<T> {
    // <T> Puede tomar cualquier tipo de dato -> devuelve un tipo genérico
    try {
        const response = await fetch(`${environment.apiUrl}/${url}`, {
            method: "GET",
            headers: getHeadersJson()
        });

        // Recupera el cuerpo de la respuesta -> lo que envia el backend: {data, message}
        const data = await response.json();

        // status 200-299 son exitosos
        if (!response.ok) {
            // Lanza exepción para manejo de respuestas no exitosas
            throw {
                status: response.status,
                message: data?.message || environment.mensajeError
            };
        }

        // Si la respuesta es exitosa devuelve el cuerpo
        return data;
    } catch (e: any) {
        // Errores de fetch o de la api
        console.error('Error fetching data:', e.name);
        throw {
            // Envia excepción al nivel superior
            status: e?.status,
            message: e?.message || environment.mensajeError
        };
    }
}

// POST -> Envía datos
export async function ejecutarQueryPost<T>(url: string, body: any): Promise<T> {
    try {
        const response = await fetch(`${environment.apiUrl}/${url}`, {
            method: "POST",
            headers: getHeadersJson(),
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || environment.mensajeError
            };
        }

        return data;
    } catch (e: any) {
        console.error('Error posting data:', e.name);
        throw {
            status: e?.status,
            message: e?.message || environment.mensajeError
        };
    }
}

export async function ejecutarQueryPostArchivos<T>(url: string, body: any): Promise<T> {
    try {
        const response = await fetch(`${environment.apiUrl}/${url}`, {
            method: "POST",
            headers: getHeadersArchivos(),
            body: body
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || environment.mensajeError
            };
        }

        return data;
    } catch (e: any) {
        console.error('Error posting data files:', e.name);
        throw {
            status: e?.status,
            message: e?.message || environment.mensajeError
        };
    }
}

// PUT -> Actualiza datos
export async function putData<T>(url: string, body: any): Promise<T> {
    try {
        const response = await fetch(`${environment.apiUrl}/${url}`, {
            method: "PUT",
            headers: getHeadersJson(),
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || environment.mensajeError
            };
        }

        return data;
    } catch (e: any) {
        console.error('Error updating data:', e.name);
        throw {
            status: e?.status,
            message: e?.message || environment.mensajeError
        };
    }
}

// PATCH -> Actualiza datos parcialmente
export async function patchData<T>(url: string, body: any): Promise<T> {
    try {
        const response = await fetch(`${environment.apiUrl}/${url}`, {
            method: "PATCH",
            headers: getHeadersJson(),
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || environment.mensajeError
            };
        }

        return data;
    } catch (e: any) {
        console.error('Error updating data:', e.name);
        throw {
            status: e?.status,
            message: e?.message || environment.mensajeError
        };
    }
}

// DELETE -> Elimina datos
export async function deleteData<T>(url: string): Promise<T> {
    try {
        const response = await fetch(`${environment.apiUrl}/${url}`, {
            method: "DELETE",
            headers: getHeadersJson()
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data?.message || environment.mensajeError
            };
        }

        return data;
    } catch (e: any) {
        console.error('Error deleting data:', e.name);
        throw {
            status: e?.status,
            message: e?.message || environment.mensajeError
        };
    }
}