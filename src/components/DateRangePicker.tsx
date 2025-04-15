import React, {useEffect, useState} from "react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverPortal,
} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "lucide-react";
import TimePickerSplit from "@/components/TimePicker";
import {DateRange as DayPickerDateRange} from "react-day-picker";
import {cn} from "@/lib/utils.ts"; // Assicurati che il percorso sia corretto

// Definizione del tipo per il range (usando lo stesso tipo usato precedentemente nel DateRangePicker)
export interface DateRange {
    from?: Date;
    to?: Date;
}

export interface DateRangePickerProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: DateRange | undefined;
    placeholder?: string;
    onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({className, value, placeholder, onChange}: DateRangePickerProps) {
    const [open, setOpen] = useState(false);
    // Stato temporaneo per gestire la selezione di data e orario insieme
    const [tempRange, setTempRange] = useState<DateRange>({
        from: value?.from,
        to: value?.to,
    });

    // Aggiorna lo stato temporaneo quando il valore esterno cambia.
    useEffect(() => {
        setTempRange({
            from: value?.from,
            to: value?.to,
        });
    }, [value]);

    // Quando si seleziona la data dal calendario, aggiorna il tempRange;
    // in questo caso, preserviamo l'orario già impostato se presente.
    const handleCalendarSelect = (range: DateRange | undefined) => {
        setTempRange((prev) => ({
            from: range?.from || prev.from,
            to: range?.to || prev.to,
        }));
    };

    // Gestisce l'aggiornamento dell'orario per la data "from"
    const handleFromTimeChange = (time: string) => {
        if (tempRange.from) {
            const [hourStr, minuteStr] = time.split(":");
            const newDate = new Date(tempRange.from);
            newDate.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10));
            setTempRange((prev) => ({...prev, from: newDate}));
        }
    };

    // Gestisce l'aggiornamento dell'orario per la data "to"
    const handleToTimeChange = (time: string) => {
        if (tempRange.to) {
            const [hourStr, minuteStr] = time.split(":");
            const newDate = new Date(tempRange.to);
            newDate.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10));
            setTempRange((prev) => ({...prev, to: newDate}));
        }
    };

    // Conferma la selezione e notifica il componente padre
    const handleConfirm = () => {
        onChange(tempRange);
        setOpen(false);
    };

    // Default per i TimePickerSplit
    const defaultFromTime = tempRange.from ? format(tempRange.from, "HH:mm") : "00:00";
    const defaultToTime = tempRange.to ? format(tempRange.to, "HH:mm") : "00:00";

    return (
        <Popover open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            // Facoltativamente: se si chiude il dialog, puoi resetare tempRange
            if (!isOpen) {
                setTempRange({
                    from: value?.from,
                    to: value?.to,
                });
            }
        }} modal>
            <PopoverTrigger asChild>
                <Button
                    id="date-range"
                    variant="outline"
                    className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                    onClick={() => setOpen(true)}
                >
                    {value?.from ? (
                        value?.to ? (
                            <>
                                {format(value.from, "LLL dd, y HH:mm")} - {format(value.to, "LLL dd, y HH:mm")}
                            </>
                        ) : (
                            format(value.from, "LLL dd, y HH:mm")
                        )
                    ) : (
                        <span>{placeholder || "Seleziona una data"}</span>
                    )}
                    <CalendarIcon className="ml-auto !h-5 !w-5 opacity-50 -translate-y-[110%]"/>
                </Button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent side="bottom" align="start" className="w-auto p-4 relative">
                    <div onPointerDown={(e) => e.stopPropagation()}>
                        {/* Calendar per selezionare la data range */}
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={value?.from}
                            selected={
                                tempRange.from
                                    ? ({from: tempRange.from, to: tempRange.to} as DayPickerDateRange)
                                    : undefined
                            }
                            onSelect={handleCalendarSelect}
                            numberOfMonths={2}
                        />
                        {/* Due TimePicker per le ore */}
                        <div className="mt-4 flex items-center justify-evenly gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">From Time</label>
                                <TimePickerSplit
                                    defaultValue={defaultFromTime}
                                    onChange={handleFromTimeChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">To Time</label>
                                <TimePickerSplit
                                    defaultValue={defaultToTime}
                                    onChange={handleToTimeChange}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleConfirm}>Confirm</Button>
                        </div>
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    );
}

export default DateRangePicker;
