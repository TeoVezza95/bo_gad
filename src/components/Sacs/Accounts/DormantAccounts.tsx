import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {sacsDormantAccountsColumns, statusMapping} from "@/components/GenericTableColumn.tsx";
import {SacsDormantAccount, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {sacsDormantAccounts} from "@/services/sacs_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

// Schema
const sacsDormantAccountFilterSchema = z.object({
    contractId: z.string().optional(),
});

// Definizione dei campi filtro
const sacsDormantAccountFilterFields: FilterField<z.infer<typeof sacsDormantAccountFilterSchema>>[] = [
    {field: "contractId", label: "Conto Gioco", type: "text"},
];

const SacsDormantAccounts = () => {
    const [sacsDormantAccount, setSacsDormantAccount] = useState<SacsDormantAccount[]>([]);
    const [sacsDormantAccountFilters, setSacsDormantAccountFilters] = useState<z.infer<typeof sacsDormantAccountFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [sacsDormantAccountFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        sacsDormantAccounts(sacsDormantAccountFilters, currentPage, pageSize)
            .then((response: {
                dormantAccounts: SacsDormantAccount[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setSacsDormantAccount(response.dormantAccounts);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in sacsDormantAccounts:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data sacsDormantAccounts:", filters);
        setSacsDormantAccountFilters(filters as z.infer<typeof sacsDormantAccountFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof sacsDormantAccountFilterSchema>>
                schema={sacsDormantAccountFilterSchema}
                filters={sacsDormantAccountFilters}
                mapping={statusMapping}
                filterFields={sacsDormantAccountFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={sacsDormantAccount} columns={sacsDormantAccountsColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default SacsDormantAccounts;