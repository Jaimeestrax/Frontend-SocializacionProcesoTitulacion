"use client";

import { MessageSquareQuote } from "lucide-react";
import { useState } from "react";
import { ChatbotWindow } from "./chatbot-window";

export function ChatbotButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {open && <ChatbotWindow onClose={() => setOpen(false)} />}

            <button
                className="fixed bottom-10 right-10 bg-primary text-secondary rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <MessageSquareQuote size={30} />
            </button>
        </>
    );
}