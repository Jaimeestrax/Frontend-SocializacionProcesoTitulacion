"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BreadcrumbNav } from "@/components/detalle-subproceso/breadcrumb-nav";
import { SubprocessHeader } from "@/components/detalle-subproceso/subprocess-header";
import { SubprocessSummary } from "@/components/detalle-subproceso/subprocess-summary";
import { ActivityTimeline } from "@/components/detalle-subproceso/activity-timeline";
import { ContextualPanel } from "@/components/detalle-subproceso/contextual-panel";

import { usePlanificacion } from "@/hooks/use-planificacion";

export default function DetalleSubprocesoPage() {
    const { id } = useParams();
    const { obtenerSubprocesoEspecificoPlanificacion, loading } = usePlanificacion();

    const [subprocesoEspecifico, setSubprocesoEspecifico] = useState<any>(null);

    const obtenerSubproceso = async () => {
        try {
            const res = await obtenerSubprocesoEspecificoPlanificacion(String(id));
            console.log("Subproceso:", res.data);
            setSubprocesoEspecifico(res.data);
            //toast.success(res.message);
        } catch (error: any) {
            console.error("Error al obtener el subproceso:", error.message);
            //toast.error(error.message);
        }
    }

    useEffect(() => {
        obtenerSubproceso();
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

            {/* Sección de navegación */}
            <BreadcrumbNav currentPath={subprocesoEspecifico?.nombre} />

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Columna izquierda */}
                <div className="flex-1 lg:w-2/3 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Header con progreso de la etapa */}
                        <SubprocessHeader data={subprocesoEspecifico} />

                        {/* Resumen en Cards */}
                        <SubprocessSummary data={subprocesoEspecifico} />
                    </motion.div>

                    {/* Timeline de Actividades */}
                    <ActivityTimeline data={subprocesoEspecifico} />

                </div>

                {/* Sidebar derecha */}
                <div className="lg:w-1/3 shrink-0">
                    <ContextualPanel data={subprocesoEspecifico} />
                </div>

            </div>
        </div>
    );
}
