import { useEffect, useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";

interface FileUploadFieldProps {
    id?: string;
    label?: string;
    accept?: string;
    required?: boolean;
    reset?: boolean;
    onChange?: (file: File | null) => void;
}

const EXT_COLORS: Record<string, string> = {
    pdf: "#E24B4A", docx: "#185FA5", xlsx: "#3B6D11", pptx: "#BA7517",
    png: "#534AB7", jpg: "#993556", jpeg: "#993556", gif: "#0F6E56",
    mp4: "#3C3489", zip: "#5F5E5A", csv: "#3B6D11",
};

function formatBytes(b: number): string {
    if (b < 1024) return `${b} B`;
    if (b < 1_048_576) return `${Math.round(b / 1024)} KB`;
    return `${(b / 1_048_576).toFixed(1)} MB`;
}

function getExt(name: string): string {
    return name.split(".").pop()?.toLowerCase() ?? "";
}

export default function FileUploadField({
    id = "archivo",
    label = "ARCHIVO",
    accept,
    required = false,
    reset = false,
    onChange,
}: FileUploadFieldProps) {
    const [file, setFile] = useState<File | null>(null);
    const [objectURL, setObjectURL] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (reset) {
            if (objectURL) URL.revokeObjectURL(objectURL);
            setFile(null);
            setObjectURL(null);
            if (inputRef.current) inputRef.current.value = "";
            onChange?.(null);
        }
    }, [reset]);

    const handleFile = useCallback(
        (f: File) => {
            if (objectURL) URL.revokeObjectURL(objectURL);
            const url = URL.createObjectURL(f);
            setFile(f);
            setObjectURL(url);
            onChange?.(f);
        },
        [objectURL, onChange]
    );

    const clearFile = () => {
        if (objectURL) URL.revokeObjectURL(objectURL);
        setFile(null);
        setObjectURL(null);
        if (inputRef.current) inputRef.current.value = "";
        onChange?.(null);
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const ext = file ? getExt(file.name) : "";
    const accentColor = EXT_COLORS[ext] ?? "#888780";

    return (
        <div className="flex flex-col gap-2">
            {/* Label */}
            <label
                htmlFor={id}
                className="text-xs font-semibold"
            >
                {label}
            </label>

            {/* Drop zone */}
            <div
                role="button"
                tabIndex={0}
                aria-label="Área de carga de archivo"
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                className={[
                    "relative rounded-xl border-[1.5px] border-dashed transition-all duration-200",
                    "cursor-pointer select-none",
                    isDragging
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                        : "border-foreground/20 bg-foreground/5 hover:border-primary hover:bg-muted/60",
                ].join(" ")}
            >
                {/* Hidden input — only shown when no file selected */}
                {!file && (
                    <input
                        ref={inputRef}
                        id={id}
                        type="file"
                        accept={accept}
                        required={required}
                        onChange={onInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                )}

                {/* Drag overlay */}
                {isDragging && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-400 pointer-events-none">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Suelta el archivo aquí
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!file ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center bg-secondary">
                        {/* Icon */}
                        <div className="mb-1">
                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                                <rect x="6" y="3" width="20" height="26" rx="3"
                                    fill="hsl(var(--primary)/0.08)"
                                    stroke="hsl(var(--primary)/0.35)" strokeWidth="1.2" />
                                <path d="M23 3v7h7" stroke="hsl(var(--primary)/0.35)" strokeWidth="1.2" fill="none" />
                                <path d="M23 3l7 7" stroke="hsl(var(--primary)/0.35)" strokeWidth="1.2" />
                                <circle cx="28" cy="28" r="9"
                                    fill="white"
                                    stroke="hsl(var(--border))" strokeWidth="1" />
                                <path d="M28 24v8M24 28h8"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Arrastra tu archivo aquí
                        </p>
                        <p className="text-xs text-muted-foreground">
                            o haz clic para seleccionar
                        </p>
                        <span className="mt-1 text-[11px] text-muted-foreground/70 bg-background border border-border/60 rounded-full px-3 py-1">
                            {accept ?? "PDF, DOCX, XLSX, PNG, JPG..."}
                        </span>
                    </div>
                ) : (
                    /* File selected state */
                    <div className="flex flex-col gap-2 p-4">
                        <div className="flex items-center gap-3 bg-background border border-border/50 rounded-lg px-3 py-2.5">
                            {/* File type icon */}
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${accentColor}18` }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <rect x="2" y="1" width="11" height="15" rx="2"
                                        fill={`${accentColor}18`}
                                        stroke={`${accentColor}99`} strokeWidth="1" />
                                    <path d="M10 1v5h5" stroke={`${accentColor}99`} strokeWidth="1" fill="none" />
                                    <path d="M10 1l5 5" stroke={`${accentColor}99`} strokeWidth="1" />
                                </svg>
                            </div>

                            {/* File info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-foreground truncate">
                                    {file.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {formatBytes(file.size)} · .{ext.toUpperCase()}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1.5 shrink-0">
                                {objectURL && (
                                    <button
                                        type="button"
                                        title="Abrir en nueva pestaña"
                                        onClick={() => window.open(objectURL, "_blank")}
                                        className="w-7 h-7 rounded-md border border-border/60 bg-transparent hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <path d="M5.5 2.5H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7"
                                                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                            <path d="M8 1.5h3.5V5M11.5 1.5L6 7"
                                                stroke="currentColor" strokeWidth="1.2"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    title="Quitar archivo"
                                    onClick={clearFile}
                                    className="w-7 h-7 rounded-md border border-border/60 bg-transparent hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M1 1l10 10M11 1L1 11"
                                            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Success badge */}
                        <p className="text-[11px] text-green-600 dark:text-green-400 flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle cx="6" cy="6" r="5"
                                    fill="currentColor" fillOpacity="0.12"
                                    stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
                                <path d="M3.5 6l1.8 1.8L8.5 4"
                                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Archivo listo para subir
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}