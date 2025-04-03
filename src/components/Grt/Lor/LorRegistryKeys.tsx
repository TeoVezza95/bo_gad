import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorRegistryKeyColumns} from "@/components/GenericTableColumn.tsx";
import {LorRegistryKey, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorRegistryKeys} from "@/services/lor_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

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
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [registryKeysFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        lorRegistryKeys(registryKeysFilters, currentPage, pageSize)
            .then((response: {
                registrationKeys: LorRegistryKey[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setRegistryKeys(response.registrationKeys);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in lorTransactions:", error);
            });
    };

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data registryKeys:", filters);
        setRegistryKeysFilters(filters as z.infer<typeof registryKeysFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof registryKeysFilterSchema>>
                schema={registryKeysFilterSchema}
                filters={registryKeysFilters}
                filterFields={registryKeysFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={registryKeys} columns={lorRegistryKeyColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LorRegistryKeys