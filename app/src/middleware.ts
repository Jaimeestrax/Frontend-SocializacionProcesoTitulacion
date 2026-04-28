import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Toma el token de la cookie
    const token = request.cookies.get("token")?.value;

    // Obtiene la ruta actual
    const { pathname } = request.nextUrl;

    // Rutas protegidas
    const rutasProtegidas = ["/dashboard", "/gestion-subprocesos", "/gestion-instrumentos", "/mi-perfil"];
    // Rutas publicas
    const rutasPublicas = ["/auth/sign-in", "/home", "/subprocesos"];

    const esRutaProtegida = rutasProtegidas.some(r => pathname.startsWith(r));
    const esRutaPublica = rutasPublicas.includes(pathname);

    // No autenticado intentando entrar a ruta protegida
    if (!token && esRutaProtegida) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Autenticado intentando ir a login
    if (token && pathname === "/auth/sign-in") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}