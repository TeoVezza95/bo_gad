import * as React from "react";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverPortal,
} from "@/components/ui/popover";

export interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
}

export function DatePicker({
                               value,
                               onChange,
                               placeholder,
                               className,
                           }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal flex justify-between",
                            !value && "text-muted-foreground",
                            className
                        )}
                        onClick={() => setOpen(true)}
                    >
                        {value ? format(value, "PPP") : <span>{placeholder || "Pick a date"}</span>}
                        <CalendarIcon className="ml-auto !h-5 !w-5 opacity-50 -translate-y-[110%]"/>
                    </Button>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent className="w-auto p-4 relative" align="start">
                    <div onPointerDown={(e) => e.stopPropagation()}>
                        <Calendar
                            mode="single"
                            selected={value ?? undefined}
                            onSelect={(date: Date | undefined) => {
                                console.log("Data selezionata:", date);
                                onChange(date ?? null);
                                // Utilizza un piccolo ritardo per assicurarti che l'evento venga processato
                                setTimeout(() => {
                                    setOpen(false);
                                }, 0);
                            }}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                        />
                    </div>
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    );
}
