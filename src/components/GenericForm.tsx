import {useEffect, useState} from "react";
import {useForm, FieldValues, DefaultValues, Path, SubmitHandler, PathValue} from "react-hook-form";
import {ZodSchema} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/DatePicker";
import {format} from "date-fns";
import {Badge} from "@/components/ui/badge";

// Definizione del tipo per ogni campo filtro
export interface FilterField<FilterValues> {
    field: keyof FilterValues;
    label: string;
    type?: "text" | "number" | "date" | "select" | "daterange";
    options?: { label: string; value: string }[];
}

// Props per il componente GenericFilters
export interface GenericFiltersProps<FilterValues extends FieldValues> {
    schema: ZodSchema<FilterValues>;
    filters?: FilterValues;
    buttonName?: string;
    filterFields: FilterField<FilterValues>[];
    onSubmit: (values: FilterValues) => void;
}

export function GenericForm<FilterValues extends FieldValues>({
                                                                  schema,
                                                                  filters = {} as FilterValues, // Usa i filtri passati dal padre come valore iniziale
                                                                  filterFields,
                                                                  buttonName,
                                                                  onSubmit,
                                                              }: GenericFiltersProps<FilterValues>) {
    const form = useForm<FilterValues>({
        resolver: zodResolver(schema),
        defaultValues: filters as DefaultValues<FilterValues>,
        // mode: "onBlur"
    });

    const [activeFilters, setActiveFilters] = useState<FilterValues>(filters);

    // Sincronizza `activeFilters` con `filters` passati dal padre
    useEffect(() => {
        setActiveFilters(filters);
        form.reset(filters);
    }, [filters]); // Qui ho cambiato la dipendenza in modo da ascoltare i cambiamenti dei filtri passati dal padre

    const handleRemoveFilter = (key: string) => {
        setActiveFilters((prevFilters) => {
            const updatedFilters = {...prevFilters};
            delete updatedFilters[key];
            return updatedFilters;
        });

        form.setValue(key as Path<FilterValues>, "" as PathValue<FilterValues, Path<FilterValues>>);

        const newFilters = {...activeFilters};
        delete newFilters[key];
        onSubmit(newFilters);
    };

    // Gestione del submit
    const handleSubmit: SubmitHandler<FilterValues> = (values) => {
        const filteredValues = Object.fromEntries(
            Object.entries(values).filter(([, value]) => value !== undefined && value !== "")
        ) as FilterValues;

        setActiveFilters(filteredValues);
        onSubmit(filteredValues);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Visualizza i badge dei filtri attivi */}
            <div className="flex flex-wrap gap-4 justify-start mb-4">
                {Object.entries(activeFilters)
                    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
                    .map(([key, value]) => (
                        <Badge key={key} variant="gadBlue" className="flex items-center justify-between px-3 py-1">
                            <div className="flex-1">{`${key}: ${value}`}</div>
                            <Button
                                className="bg-gadBlue h-2 w-2 p-1 ml-2 flex items-center justify-center"
                                onClick={() => handleRemoveFilter(key)}
                            >
                                <X size={12}/>
                            </Button>
                        </Badge>
                    ))}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-4 gap-4">
                        {filterFields.map((fieldDef, idx) => (
                            <FormField
                                key={idx}
                                control={form.control}
                                name={fieldDef.field as Path<FilterValues>}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>{fieldDef.label}</FormLabel>
                                        <FormControl>
                                            {fieldDef.type === "select" ? (
                                                <select
                                                    {...field}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                    required
                                                >
                                                    <option value="">-- Seleziona --</option>
                                                    {fieldDef.options?.map((option, optIdx) => (
                                                        <option key={optIdx} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : fieldDef.type === "date" ? (
                                                <DatePicker
                                                    value={field.value ? new Date(field.value) : null}
                                                    onChange={(date: Date | null) => {
                                                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                                    }}
                                                    placeholder={fieldDef.label}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                />
                                            ) : (
                                                <Input
                                                    placeholder={fieldDef.label}
                                                    {...field}
                                                    type={fieldDef.type || "text"}
                                                    required
                                                />
                                            )}
                                        </FormControl>
                                        <FormDescription>Inserisci {fieldDef.label}</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                    {/* Bottone per inviare il form */}
                    <div className="mt-4">
                        <Button type="submit">{buttonName || "Invia"}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

