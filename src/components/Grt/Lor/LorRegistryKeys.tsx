import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorRegistryKeyColumns} from "@/components/GenericTableColumn.tsx";
import {LorRegistryKey, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorRegistryKeys} from "@/services/lor_services.ts";

// Schema per le registry keys
const registryKeysFilterSchema = z.object({
    contractId: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro per le registry keys
const registryKeysFilterFields: FilterField<z.infer<typeof registryKeysFilterSchema>>[] = [
    {field: "contractId", label: "Conto Gioco", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const LorRegistryKeys = () => {
    const [registryKeys, setRegistryKeys] = useState<LorRegistryKey[]>([]);
    const [registryKeysFilters, setRegistryKeysFilters] = useState<z.infer<typeof registryKeysFilterSchema>>({});

    useEffect(() => {
        lorRegistryKeys(registryKeysFilters)
            .then((response: LorRegistryKey[]) => {
                setRegistryKeys(response);
            })
            .catch((error: unknown) => {
                console.error("Error in registryKeys:", error);
            });
    }, [registryKeysFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "registryKeys",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "registryKeys") {
            setRegistryKeysFilters(filters as z.infer<typeof registryKeysFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof registryKeysFilterSchema>>
                schema={registryKeysFilterSchema}
                filters={registryKeysFilters}
                filterFields={registryKeysFilterFields}
                onFilter={(values) => handleFilter("registryKeys", values)}
            />
            <GenericTable data={registryKeys} columns={lorRegistryKeyColumns}/>
        </>
    )
}
export default LorRegistryKeys