"use client";

import { useState } from "react";
import faqService from "@/services/faq_service";
import { Faq } from "@/DTOs/faq";
import { Busqueda } from "@/constants/busqueda";

export function useFaqs() {
    const [loading, setLoading] = useState(false);

    const registrarFaq = async (faq: Faq) => {
        try {
            setLoading(true);

            const res = await faqService.registrarFaq(faq);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerFaqs = async (busqueda: Busqueda) => {
        try {
            setLoading(true);

            const res = await faqService.obtenerFaqs(busqueda);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const obtenerFaqPorId = async (id: string) => {
        try {
            setLoading(true);

            const res = await faqService.obtenerFaqPorId(id);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const actualizarFaq = async (id: string, data: Faq) => {
        try {
            setLoading(true);

            const res = await faqService.actualizarFaq(id, data);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const eliminarFaq = async (id: string) => {
        try {
            setLoading(true);

            const res = await faqService.eliminarFaq(id);

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const contarFaqs = async () => {
        try {
            setLoading(true);

            const res = await faqService.contarFaqs();

            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        registrarFaq,
        obtenerFaqs,
        obtenerFaqPorId,
        actualizarFaq,
        eliminarFaq,
        contarFaqs,
        loading
    };
}