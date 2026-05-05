import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // Toma el token de la cookie
    const token = request.cookies.get("token")?.value;

    // Obtiene la ruta actual
    const { pathname } = request.nextUrl;

    // Rutas protegidas
    const rutasProtegidas = [
        "/dashboard", "/gestion-subprocesos", "/gestion-instrumentos",
        "/gestion-usuarios", "/gestion-roles", "/gestion-cargos"
    ];
    // Rutas publicas
    const rutasPublicas = ["/auth/sign-in", "/home", "/subprocesos"];

    const esRutaProtegida = rutasProtegidas.includes(pathname);
    const esRutaPublica = rutasPublicas.includes(pathname);

    // No autenticado intentando entrar a ruta protegida
    if (!token && esRutaProtegida) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Autenticado intentando ir a login
    if (token && pathname === "/auth/sign-in") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Autenticado al cargar directo al dashboard
    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}