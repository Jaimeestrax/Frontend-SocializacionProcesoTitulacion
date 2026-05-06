import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas y roles que pueden acceder a ellas
const rutasProtegidas: Record<string, number[]> = {
    "/dashboard": [1, 2],
    "/gestion-subprocesos": [1, 2],
    "/gestion-instrumentos": [1, 2],
    "/gestion-usuarios": [1],
    "/gestion-roles": [1],
    "/gestion-cargos": [1]
};

// Función para decodificar el payload del token
function decodePayload(token: string) {
    try {
        const base64 = token.split(".")[1]; // Toma el payload -> header.payload.signature
        return JSON.parse(atob(base64)); // Atob decodifica base64 y luego se convierte a JSON
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    // Toma el token de la cookie
    const token = request.cookies.get("token")?.value;

    // Obtiene la ruta actual
    const { pathname } = request.nextUrl;

    // Verifica los roles que pueden acceder a esa ruta
    const rolesPermitidos = rutasProtegidas[pathname];
    // Verifica que la ruta exista en el diccionario -> determina si es una ruta protegida
    const esRutaProtegida = Boolean(rolesPermitidos);

    // No autenticado intentando entrar a ruta protegida
    if (!token && esRutaProtegida) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Autenticado intentando ir a login o raiz
    if (token && (pathname === "/auth/sign-in" || pathname === "/")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Usuario autenticado ingresando a una ruta protegida -> verifica que el rol tenga acceso
    if (token && esRutaProtegida) {
        // Decodifica el payload
        const payload = decodePayload(token);

        // Token malformado -> en caso de manipulación del token
        if (!payload) {
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }

        // Rol no autorizado para la ruta
        if (!rolesPermitidos.includes(payload.rol)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // Pasa la petición
    return NextResponse.next();
}