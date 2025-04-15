import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect"; // Assicurati di usare il percorso corretto

interface TimePickerSplitProps {
    /** Valore di default (formato "HH:mm"), es. "08:30" */
    defaultValue?: string;
    /** Intervallo per i minuti (default: 15) */
    minuteInterval?: number;
    /** Callback che riceve il valore completo nel formato "HH:mm" al cambio */
    onChange: (value: string) => void;
}

const TimePickerSplit: React.FC<TimePickerSplitProps> = ({
                                                             defaultValue,
                                                             minuteInterval = 15,
                                                             onChange,
                                                         }) => {
    // Genera le ore da "00" a "23"
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0")
    );

    // Genera i minuti in base all'intervallo
    const minutes = [];
    for (let m = 0; m < 60; m += minuteInterval) {
        minutes.push(m.toString().padStart(2, "0"));
    }

    // Stato iniziale per ore e minuti, basato su defaultValue (oppure "00")
    const [selectedHour, setSelectedHour] = useState<string>(
        defaultValue ? defaultValue.split(":")[0] : "00"
    );
    const [selectedMinute, setSelectedMinute] = useState<string>(
        defaultValue ? defaultValue.split(":")[1] : "00"
    );

    // Ogni volta che cambiano selectedHour o selectedMinute, notifichiamo il valore completo
    useEffect(() => {
        onChange(`${selectedHour}:${selectedMinute}`);
    }, [selectedHour, selectedMinute, onChange]);

    return (
        <div className="flex items-center space-x-2">
            <CustomSelect
                items={hours}
                defaultValue={selectedHour}
                onChange={(value) => {
                    setSelectedHour(value);
                }}
            />
            <span>:</span>
            <CustomSelect
                items={minutes}
                defaultValue={selectedMinute}
                onChange={(value) => {
                    setSelectedMinute(value);
                }}
            />
        </div>
    );
};

export default TimePickerSplit;
