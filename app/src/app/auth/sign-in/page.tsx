import FormLogin from "@/components/form-login";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from 'lucide-react';

export default function SignInPage() {
    return (
        <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-md border border-gray-300 dark:border-gray-900">

            <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center">
                    <img src="/images/logo.png" alt="logo" className="w-18 h-30" />
                </div>
            </div>

            <h2 className="text-center text-xl font-semibold md:text-2xl">
                Inicio de sesión
            </h2>

            <p className="text-center text-sm text-muted-foreground mb-6 md:text-md">
                Inicie sesión para administrar el contenido
            </p>

            <FormLogin />

            <div className="flex items-center justify-center mt-6">
                <Badge className="bg-success text-success-foreground font-bold text-xs md:text-sm">
                    <ShieldCheck data-icon="inline-start" />
                    SOLO PERSONAL AUTORIZADO
                </Badge>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 md:text-sm">
                Acceso restringido solo para la comisión de titulación. <br />
                Los intentos de acceso no autorizado son monitoreados y registrados.
            </p>

        </div>
    );
}