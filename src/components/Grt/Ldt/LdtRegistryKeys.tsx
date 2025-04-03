import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ldtRegistryKeyColumns} from "@/components/GenericTableColumn.tsx";
import {LdtRegistryKey, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import PaginationControls from "@/components/PaginatorControls.tsx";
import {ldtRegistryKeys} from "@/services/ldt_services.ts";

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

const LdtRegistryKeys = () => {
    const [registryKeys, setRegistryKeys] = useState<LdtRegistryKey[]>([]);
    const [registryKeysFilters, setRegistryKeysFilters] = useState<z.infer<typeof registryKeysFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [registryKeysFilters])
    
    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        ldtRegistryKeys(registryKeysFilters, currentPage, pageSize)
            .then((response: {
                registrationKeys: LdtRegistryKey[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setRegistryKeys(response.registrationKeys);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtTransactions:", error);
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
            <GenericTable data={registryKeys} columns={ldtRegistryKeyColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LdtRegistryKeys