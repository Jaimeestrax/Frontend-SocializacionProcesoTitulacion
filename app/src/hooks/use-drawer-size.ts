import { useState, useEffect } from "react";

export function useDrawerDirection() {
    const [direction, setDirection] = useState<"bottom" | "right">("bottom");

    useEffect(() => {
        {/** 768 breakpoint de tailwind para menos de md */ }
        const updateDirection = () => {
            setDirection(window.innerWidth >= 768 ? "right" : "bottom")
        };
        updateDirection();
        window.addEventListener("resize", updateDirection);
        return () => window.removeEventListener("resize", updateDirection);
    }, []);

    return direction;
}