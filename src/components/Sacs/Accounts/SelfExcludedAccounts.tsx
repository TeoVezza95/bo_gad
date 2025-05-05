import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {sacsSelfExcludedAccountsColumns, statusMapping} from "@/components/GenericTableColumn.tsx";
import {SacsSelfExcludedAccount, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {sacsSelfExcludedAccounts} from "@/services/sacs_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

// Schema
const sacsSelfExcludedAccountFilterSchema = z.object({
    contractId: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro
const sacsSelfExcludedAccountFilterFields: FilterField<z.infer<typeof sacsSelfExcludedAccountFilterSchema>>[] = [
    {field: "contractId", label: "Conto Gioco", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const SacsSelfExcludedAccounts = () => {
    const [sacsSelfExcludedAccount, setSacsSelfExcludedAccount] = useState<SacsSelfExcludedAccount[]>([]);
    const [sacsSelfExcludedAccountFilters, setSacsSelfExcludedAccountFilters] = useState<z.infer<typeof sacsSelfExcludedAccountFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [sacsSelfExcludedAccountFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        sacsSelfExcludedAccounts(sacsSelfExcludedAccountFilters, currentPage, pageSize)
            .then((response: {
                selfExcludedAccounts: SacsSelfExcludedAccount[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setSacsSelfExcludedAccount(response.selfExcludedAccounts);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in sacsSelfExcludedAccounts:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data sacsSelfExcludedAccounts:", filters);
        setSacsSelfExcludedAccountFilters(filters as z.infer<typeof sacsSelfExcludedAccountFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof sacsSelfExcludedAccountFilterSchema>>
                schema={sacsSelfExcludedAccountFilterSchema}
                filters={sacsSelfExcludedAccountFilters}
                mapping={statusMapping}
                filterFields={sacsSelfExcludedAccountFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={sacsSelfExcludedAccount} columns={sacsSelfExcludedAccountsColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default SacsSelfExcludedAccounts;