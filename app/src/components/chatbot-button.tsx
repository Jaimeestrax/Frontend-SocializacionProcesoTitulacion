"use client";

import { MessageSquareQuote } from "lucide-react";

export function ChatbotButton() {
    return (
        <button
            className="bg-primary text-secondary rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
            onClick={() => console.log("abrir/cerrar chatbot")}
        >
            <MessageSquareQuote size={30} />
        </button>
    );
}