import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
    title: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
    subtitle: { fontSize: 10, color: "#6b7280", marginBottom: 16 },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#f3f4f6",
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
        gap: 8,
    },
    gridItem: { width: "48%" },
    label: { fontSize: 8, color: "#6b7280", marginBottom: 2 },
    value: { fontSize: 10, fontWeight: "bold" },
    badge: {
        backgroundColor: "#22c55e",
        color: "white",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 8,
        alignSelf: "flex-start",
    },
    badgeRed: { backgroundColor: "#ef4444" },
    subprocesoBox: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 6,
        marginBottom: 10,
        overflow: "hidden",
    },
    subprocesoHeader: {
        backgroundColor: "#f9fafb",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    subprocesoTitle: { fontSize: 10, fontWeight: "bold" },
    subprocesoMeta: { fontSize: 8, color: "#6b7280", marginTop: 2 },
    subprocesoBody: { padding: 10 },
    actividadBox: {
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 4,
        padding: 8,
        marginBottom: 6,
    },
    actividadTitle: { fontSize: 9, fontWeight: "bold" },
    actividadDesc: { fontSize: 8, color: "#6b7280", marginTop: 2 },
    actividadFechas: { flexDirection: "row", gap: 12, marginTop: 4 },
    participanteBadge: {
        backgroundColor: "#3b82f6",
        color: "white",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 7,
        alignSelf: "flex-start",
        marginTop: 4,
    },
    instrSection: { marginTop: 6 },
    instrLabel: { fontSize: 8, fontWeight: "bold", color: "#6b7280", marginBottom: 3 },
    instrRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
    instrBadge: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 3,
        fontSize: 7,
        fontFamily: "Courier",
    },
    instrNombre: { fontSize: 8 },
});

const formatearFecha = (fecha: any) => {
    if (!fecha) return "S/N";
    return new Date(fecha).toLocaleDateString("es-EC", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export function PlanificacionPDF({ detalle }: { detalle: any }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Encabezado */}
                <Text style={styles.title}>Detalle de planificación</Text>
                <Text style={styles.subtitle}>
                    Periodo académico: {detalle?.periodo}
                </Text>

                {/* Resumen */}
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>FECHA INICIO PERIODO</Text>
                        <Text style={styles.value}>{formatearFecha(detalle?.fechaInicio)}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>FECHA FIN PERIODO</Text>
                        <Text style={styles.value}>{formatearFecha(detalle?.fechaFin)}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>ESTADO</Text>
                        <View style={[styles.badge, !detalle?.estado ? styles.badgeRed : {}]}>
                            <Text>{detalle?.estado ? "Vigente" : "No vigente"}</Text>
                        </View>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.label}>Nro. SUBPROCESOS</Text>
                        <Text style={styles.value}>{detalle?.subprocesos?.length || 0}</Text>
                    </View>
                </View>

                {/* Subprocesos */}
                {detalle?.subprocesos?.map((sp: any, si: number) => (
                    <View key={si} style={styles.subprocesoBox}>
                        <View style={styles.subprocesoHeader}>
                            <Text style={styles.subprocesoTitle}>
                                {si + 1}.- {sp.identificador}: {sp.nombre}
                            </Text>
                            <Text style={styles.subprocesoMeta}>
                                Inicio: {formatearFecha(sp.fechaInicio)}  |  Fin: {formatearFecha(sp.fechaFin)}
                            </Text>
                            {sp.descripcion && (
                                <Text style={[styles.subprocesoMeta, { marginTop: 2 }]}>
                                    {sp.descripcion}
                                </Text>
                            )}
                        </View>

                        <View style={styles.subprocesoBody}>
                            {sp.actividades?.map((act: any, ai: number) => (
                                <View key={ai} style={styles.actividadBox}>
                                    <Text style={styles.actividadTitle}>
                                        Actividad {ai + 1}: {act.nombre}
                                    </Text>
                                    {act.descripcion && (
                                        <Text style={styles.actividadDesc}>{act.descripcion}</Text>
                                    )}
                                    {act.idParticipante?.nombre && (
                                        <View style={styles.participanteBadge}>
                                            <Text>{act.idParticipante.nombre}</Text>
                                        </View>
                                    )}
                                    <View style={styles.actividadFechas}>
                                        <Text style={styles.subprocesoMeta}>
                                            Inicio: {formatearFecha(act.fechaInicio)}
                                        </Text>
                                        <Text style={styles.subprocesoMeta}>
                                            Fin: {formatearFecha(act.fechaFin)}
                                        </Text>
                                    </View>

                                    {act.instrumentos?.length > 0 && (
                                        <View style={styles.instrSection}>
                                            <Text style={styles.instrLabel}>INSTRUMENTOS</Text>
                                            {act.instrumentos.map((inst: any, ii: number) => (
                                                <View key={ii} style={styles.instrRow}>
                                                    <View style={styles.instrBadge}>
                                                        <Text>{inst.identificador}</Text>
                                                    </View>
                                                    <Text style={styles.instrNombre}>
                                                        {inst.idInstrumento?.nombre}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );
}