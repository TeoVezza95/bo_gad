import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverPortal,
} from "@/components/ui/popover";

export interface DateRangePickerProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: DateRange | undefined;
    placeholder?: string;
    onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ className, value, placeholder, onChange }: DateRangePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
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
                        value.to ? (
                            <>
                                {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(value.from, "LLL dd, y")
                        )
                    ) : (
                        <span>{placeholder || "Pick a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto !h-5 !w-5 opacity-50 -translate-y-[110%]"/>
                </Button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent side="bottom" align="start" className="w-auto p-4 relative">
                    <div onPointerDown={(e) => e.stopPropagation()}>
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={value?.from}
                            selected={value}
                            onSelect={(range: DateRange | undefined) => {
                                console.log("Range selezionato:", range);
                                onChange(range);
                                // Se l'intervallo è completo, chiudi il popover
                                if (range && range.from && range.to) {
                                    setTimeout(() => {
                                        setOpen(false);
                                    }, 0);
                                }
                            }}
                            numberOfMonths={2}
                        />
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    );
}
