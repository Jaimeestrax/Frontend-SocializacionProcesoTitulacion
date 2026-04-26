"use client";
import { toast as sonnerToast } from "sonner";
import { CircleCheckIcon, OctagonXIcon, TriangleAlertIcon, InfoIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
    id: string | number;
    message: string;
    type: ToastType;
}

const config: Record<ToastType, { icon: React.ReactNode; className: string }> = {
    success: {
        icon: <CircleCheckIcon className="size-4 shrink-0" />,
        className: "bg-success text-success-foreground border-success",
    },
    error: {
        icon: <OctagonXIcon className="size-4 shrink-0" />,
        className: "bg-destructive text-destructive-foreground border-destructive",
    },
    warning: {
        icon: <TriangleAlertIcon className="size-4 shrink-0" />,
        className: "bg-warning text-warning-foreground border-warning",
    },
    info: {
        icon: <InfoIcon className="size-4 shrink-0" />,
        className: "bg-primary text-primary-foreground border-primary",
    },
};

function CustomToast({ id, message, type }: CustomToastProps) {
    const { icon, className } = config[type];
    return (
        <div className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-lg border shadow-lg",
            className
        )}>
            {icon}
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => sonnerToast.dismiss(id)}
                className="shrink-0 size-6 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/75 transition-colors"
            >
                <X className="size-3" />
            </button>
        </div>
    );
}

export const toast = {
    success: (message: string) =>
        sonnerToast.custom((id) => <CustomToast id={id} message={message} type="success" />),
    error: (message: string) =>
        sonnerToast.custom((id) => <CustomToast id={id} message={message} type="error" />),
    warning: (message: string) =>
        sonnerToast.custom((id) => <CustomToast id={id} message={message} type="warning" />),
    info: (message: string) =>
        sonnerToast.custom((id) => <CustomToast id={id} message={message} type="info" />),
};