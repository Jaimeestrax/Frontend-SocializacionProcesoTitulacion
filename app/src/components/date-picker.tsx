"use client"
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
    if (!date) return ""
    return date.toLocaleDateString("es-EC", {
        timeZone: "UTC",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function isValidDate(date: Date | undefined) {
    if (!date) return false
    return !isNaN(date.getTime())
}

interface DatePickerInputProps {
    id: string
    label: string
    value?: Date
    onChange: (date: Date | undefined) => void
    placeholder?: string
    className?: string
    error?: string        // Para mostrar error de validación
    disabled?: boolean
}

export function DatePickerInput({
    id,
    label,
    value,
    onChange,
    placeholder = "Seleccione una fecha",
    className,
    error,
    disabled = false,
}: DatePickerInputProps) {
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date | undefined>(value)
    const [inputValue, setInputValue] = React.useState(formatDate(value))

    // Sincronizar cuando el valor externo cambia
    React.useEffect(() => {
        setInputValue(formatDate(value))
        setMonth(value)
    }, [value])

    return (
        <Field className={className}>
            <FieldLabel htmlFor={id} className="text-xs">{label}</FieldLabel>
            <InputGroup className={`py-5 px-2 ${error ? 'border border-destructive bg-destructive/10' : 'bg-secondary'}`}>
                <InputGroupInput id={id} value={inputValue} placeholder={placeholder} disabled={disabled}
                    onChange={(e) => {
                        const parsed = new Date(e.target.value)
                        setInputValue(e.target.value)
                        if (isValidDate(parsed)) {
                            setMonth(parsed)
                            onChange(parsed)
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                    className="text-xs md:text-sm" />
                <InputGroupAddon align="inline-end">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <InputGroupButton id={`${id}-picker`} variant="link" size="icon-xs" aria-label="Seleccionar fecha" disabled={disabled}>
                                <CalendarIcon />
                                <span className="sr-only">Seleccionar fecha</span>
                            </InputGroupButton>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                            <Calendar mode="single" selected={value} month={month}
                                onMonthChange={setMonth}
                                onSelect={(date) => {
                                    onChange(date)
                                    setInputValue(formatDate(date))
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </InputGroupAddon>
            </InputGroup>
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </Field>
    )
}