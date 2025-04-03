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
    onChange: (page: number) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
                                                       items,
                                                       defaultValue,
                                                       onChange,
                                                   }) => {
    return (
        <Select
            defaultValue={defaultValue?.toString()}
            onValueChange={(value: string) => {
                // Convertiamo il valore in numero per onPageChange.
                onChange(parseInt(value, 10));
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Elementi per pagina</SelectLabel>
                    {items.map((item, index) => (
                        <SelectItem key={index} value={item.toString()}>
                            {item.toString()}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default CustomSelect;
