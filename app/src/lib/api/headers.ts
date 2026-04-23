// Cuando se envia archivos es en FormData (se gestiona automáticamente) -> enviamos solo token
export function getHeadersArchivos() {
    const token = localStorage.getItem("token");
    if (token) {
        return new Headers({
            //"Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        });
    }
    return new Headers(); // si no esta logueado no envia token
}

export function getHeadersJson() {
    const token = localStorage.getItem("token");
    // Si esta logueado se envia el token y tipo de contenido
    if (token) {
        return new Headers({
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        });
    } else {
        // Si no esta logueado solo especifica el tipo de contenido
        return new Headers({
            "Content-Type": "application/json"
        });
    }
}