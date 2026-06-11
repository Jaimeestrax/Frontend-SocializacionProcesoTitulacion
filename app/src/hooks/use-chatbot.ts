"use client";

import { useState } from "react";
import chatbotService from "@/services/chatbot_service";

export function useChatbot() {
    const [loading, setLoading] = useState(false);

    const procesarMensajeUsuario = async (contexto: string, opcion: string) => {
        try {
            setLoading(true);

            const res = await chatbotService.procesarMensajeUsuario({ contexto, opcion });

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        procesarMensajeUsuario,
        loading
    };
}