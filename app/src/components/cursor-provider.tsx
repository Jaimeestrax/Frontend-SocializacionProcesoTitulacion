'use client'

import { createContext, useContext, useState } from 'react'

type CursorState = {
    label: string
    isHovered: boolean
    setHovered: (label: string) => void
    clearHovered: () => void
}

const CursorContext = createContext<CursorState | null>(null)

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [label, setLabel] = useState('')
    const [isHovered, setIsHovered] = useState(false)

    return (
        <CursorContext.Provider value={{
            label,
            isHovered,
            setHovered: (l) => { setLabel(l); setIsHovered(true) },
            clearHovered: () => { setLabel(''); setIsHovered(false) },
        }}>
            {children}
        </CursorContext.Provider>
    )
}

export const useCursor = () => {
    const ctx = useContext(CursorContext)
    if (!ctx) throw new Error('useCursor debe usarse dentro de CursorProvider')
    return ctx
}