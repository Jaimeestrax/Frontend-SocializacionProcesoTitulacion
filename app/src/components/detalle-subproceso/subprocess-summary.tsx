import { motion } from "motion/react";
import { LayoutList, CheckSquare, FileText } from "lucide-react";

export function SubprocessSummary({ data = null }: { data: any }) {
    if (!data) return;

    const totales = data.actividadesTotales;
    const completadas = data.actividadesCompletadas;

    // Contar instrumentos únicos en las actividades
    const instrumentosSet = new Set();
    data.actividades.forEach((a: any) => {
        a.instrumentos.forEach((i: any) => instrumentosSet.add(i._id));
    });

    const metrics = [
        { label: "Total actividades", value: totales, icon: LayoutList, color: 'text-blue-400' },
        { label: "Finalizadas", value: completadas, icon: CheckSquare, color: 'text-green-400' },
        { label: "Instrumentos", value: instrumentosSet.size, icon: FileText, color: 'text-amber-400' }
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-12">
            {metrics.map((m, i) => (
                <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-5 rounded-2xl bg-primary/10 border border-primary flex flex-col gap-1 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border/50">
                        <m.icon className={`w- h-4 ${m.color}`} />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-black">{m.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                            {m.label}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
