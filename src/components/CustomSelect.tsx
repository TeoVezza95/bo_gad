import React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CustomSelectProps {
    items: (number | string)[];
    defaultValue?: number | string;
    /**
     * Può essere:
     * - Un oggetto di mapping: { [optionKey: string]: JSX.Element }
     * - Oppure un oggetto con più mapping: { [field: string]: { [optionKey: string]: JSX.Element } }
     */
    mapping?: { [key: string]: { [optionKey: string]: JSX.Element } } | { [optionKey: string]: JSX.Element };
    /**
     * Se viene fornito, indica quale mapping usare dall'oggetto mapping con più campi.
     */
    mappingKey?: string | number;
    onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       items,
                                                       defaultValue,
                                                       mapping,
                                                       mappingKey,
                                                       onChange,
                                                   }) => {
    return (
        <Select
            defaultValue={defaultValue?.toString()}
            onValueChange={(value: string) => {
                onChange(value);
            }}
        >
            <SelectTrigger className="w-auto">
                <SelectValue placeholder="Select an item"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Elementi</SelectLabel>
                    {items.map((item, index) => {
                        let display: JSX.Element | string = item.toString();
                        if (mapping) {
                            if (mappingKey && mapping[mappingKey.toString()]) {
                                // mapping è un oggetto con più campi, usa quello corrispondente a mappingKey
                                display =
                                    (mapping as { [key: string]: { [optionKey: string]: JSX.Element } })[mappingKey.toString()][
                                        item.toString()
                                        ] || item.toString();
                            } else {
                                // mapping è direttamente il mapping per le opzioni
                                display =
                                    (mapping as { [optionKey: string]: JSX.Element })[item.toString()] ||
                                    item.toString();
                            }
                        }
                        return (
                            <SelectItem key={index} value={item.toString()}>
                                {display}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default CustomSelect;
