// Cuando se envia archivos es en FormData (se gestiona automáticamente) -> enviamos solo token
export function getHeadersArchivos() {
    return new Headers();
}

export function getHeadersJson() {
    return new Headers({
        "Content-Type": "application/json"
    });
}