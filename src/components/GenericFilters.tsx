import {useEffect, useState} from "react";
import {useForm, FieldValues, DefaultValues, Path, SubmitHandler, PathValue} from "react-hook-form";
import {ZodSchema} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Filter, X} from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
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
import {DateRangePicker} from "@/components/DateRangePicker.tsx";
import CustomSelect from "@/components/CustomSelect.tsx";

// Definizione del tipo per ogni campo filtro
export interface FilterField<FilterValues> {
    field: keyof FilterValues;
    label: string;
    type?: "text" | "number" | "date" | "daterange" | "select";
    options?: { label: string; value: string }[];
}

// Props per il componente GenericFilters
export interface GenericFiltersProps<FilterValues extends FieldValues> {
    schema: ZodSchema<FilterValues>;
    mapping?: { [key: string]: { [optionKey: string]: JSX.Element } } | { [optionKey: string]: JSX.Element };
    filters?: FilterValues;
    filterFields: FilterField<FilterValues>[];
    onFilter: (values: FilterValues) => void;
}

export function GenericFilters<FilterValues extends FieldValues>({
                                                                     schema,
                                                                     filters = {} as FilterValues, // Usa i filtri passati dal padre come valore iniziale
                                                                     filterFields,
                                                                     mapping,
                                                                     onFilter,
                                                                 }: GenericFiltersProps<FilterValues>) {
    const form = useForm<FilterValues>({
        resolver: zodResolver(schema),
        defaultValues: filters as DefaultValues<FilterValues>, // ✅ Corretto
    });


    const [activeFilters, setActiveFilters] = useState<FilterValues>(filters);

    // 🔹 Sincronizza `activeFilters` con `filters` passati dal padre
    useEffect(() => {
        setActiveFilters(filters);
        form.reset(filters); // Aggiorna il form quando `filters` cambia
    }, [activeFilters]);

    const handleRemoveFilter = (key: string) => {
        setActiveFilters((prevFilters) => {
            const updatedFilters = {...prevFilters};
            delete updatedFilters[key]; // 🔥 Rimuove la chiave selezionata
            return updatedFilters;
        });

        // 🔹 Resetta il campo nel form
        form.setValue(key as Path<FilterValues>, "" as PathValue<FilterValues, Path<FilterValues>>);

        // 🔹 Notifica il padre con i filtri aggiornati
        const newFilters = {...activeFilters};
        delete newFilters[key];
        onFilter(newFilters);
    };

    // 🔹 Gestione del submit
    const onSubmit: SubmitHandler<FilterValues> = (values) => {
        const filteredValues = Object.fromEntries(
            Object.entries(values).filter(([, value]) => value !== undefined && value !== "")
        ) as FilterValues;

        setActiveFilters(filteredValues); // Aggiorna lo stato locale
        onFilter(filteredValues); // Passa i filtri aggiornati al padre
    };

    return (
        <div className="w-full flex justify-between items-center">
            {/* Mostra solo badge per filtri attivi */}
            <div className="flex justify-start gap-4">
                {Object.entries(activeFilters)
                    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
                    .map(([key, value]) => {
                        const fieldDef = filterFields.find((f) => f.field.toString() === key);
                        const label = fieldDef ? fieldDef.label : key;
                        let displayContent: JSX.Element | string;

                        if (fieldDef && fieldDef.type === "daterange") {
                            // Assumiamo che value sia un oggetto con le chiavi "from" e "to"
                            const range = value as { from?: string; to?: string };
                            const formattedFrom = range.from ? format(range.from, "dd/MM/yyyy HH:mm") : "";
                            const formattedTo = range.to ? format(range.to, "dd/MM/yyyy HH:mm") : "";
                            displayContent = `${formattedFrom} - ${formattedTo}`;
                        } else {
                            displayContent = value.toString();
                            if (mapping) {
                                if (Object.prototype.hasOwnProperty.call(mapping, key)) {
                                    const fieldMapping = mapping[key] as { [optionKey: string]: JSX.Element };
                                    displayContent = fieldMapping[value.toString()] || value.toString();
                                } else {
                                    displayContent =
                                        (mapping as { [optionKey: string]: JSX.Element })[value.toString()] ||
                                        value.toString();
                                }
                            }
                        }

                        return (
                            <Badge
                                key={key}
                                variant="gadBlue"
                                className="flex items-center justify-between px-3 py-1 w-full whitespace-nowrap"
                            >
                                <div className="flex items-center whitespace-pre">{`${label}: `} {displayContent}</div>
                                <Button
                                    className="bg-gadBlue dark:bg-white dark:shadow-white h-2 w-2 p-1 ml-2 flex items-center justify-center"
                                    onClick={() => handleRemoveFilter(key)}
                                >
                                    <X size={12} className="dark:text-gadBlue"/>
                                </Button>
                            </Badge>
                        );
                    })}
            </div>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2"/> Filter
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full px-8">
                        <DrawerHeader>
                            <DrawerTitle>Applica Filtri</DrawerTitle>
                            <DrawerTitle asChild>
                                <span className="text-sm text-muted-foreground">
                                    Inserisci i criteri di filtro
                                </span>
                            </DrawerTitle>
                        </DrawerHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-3 gap-4">
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
                                                            <CustomSelect
                                                                // Mappiamo le opzioni in un array contenente i valori (o, se necessario, possiamo mappare anche le label)
                                                                items={fieldDef.options?.map((option) => option.value) || []}
                                                                mapping={mapping}
                                                                mappingKey={fieldDef.field.toString()}
                                                                // Impostiamo il valore di default, convertendolo in stringa se presente
                                                                defaultValue={field.value?.toString()}
                                                                // Quando cambia il valore, invochiamo field.onChange con il valore selezionato
                                                                onChange={(selectedValue) => {
                                                                    field.onChange(selectedValue);
                                                                }}
                                                            />
                                                        ) : fieldDef.type === "date" ? (
                                                            <DatePicker
                                                                value={field.value ? new Date(field.value) : null}
                                                                onChange={(date: Date | null) => {
                                                                    field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                                                }}
                                                                placeholder={fieldDef.label}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            />
                                                        ) : fieldDef.type === "daterange" ? (
                                                            <DateRangePicker
                                                                value={field.value}
                                                                onChange={(range) => {
                                                                    field.onChange(range);
                                                                }}
                                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            />
                                                        ) : (
                                                            <Input
                                                                placeholder={fieldDef.label}
                                                                {...field}
                                                                type={fieldDef.type || "text"}
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

                                <DrawerFooter className="flex justify-end space-x-2">
                                    <Button type="submit">Applica</Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Annulla</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </form>
                        </Form>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
