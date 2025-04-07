import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ldtTransactionColumns, statusMapping} from "@/components/GenericTableColumn.tsx";
import {LdtTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {ldtTransactions} from "@/services/ldt_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";


// Schema per le transazioni
const ldtTransactionFilterSchema = z.object({
    id: z.string().optional(),
    contractid: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
    status: z.string().optional(),
});

// Definizione dei campi filtro per le transazioni
const ldtTransactionFilterFields: FilterField<z.infer<typeof ldtTransactionFilterSchema>>[] = [
    {field: "id", label: "Transazione", type: "text"},
    {field: "contractid", label: "Conto Gioco", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
    {
        field: "status",
        label: "Stato",
        type: "select",
        options: [
            {label: "Prenotata", value: "1"},
            {label: "Completata", value: "2"},
            {label: "Annullata", value: "3"},
        ],
    },
];

const LdtTransactions = () => {
    const [ldtTransaction, setLdtTransaction] = useState<LdtTransaction[]>([]);
    const [ldtTransactionFilters, setLdtTransactionFilters] = useState<z.infer<typeof ldtTransactionFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [ldtTransactionFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        ldtTransactions(ldtTransactionFilters, currentPage, pageSize)
            .then((response: {
                transactions: LdtTransaction[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setLdtTransaction(response.transactions);
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
        console.log("Filtering data ldtTransactions:", filters);
        setLdtTransactionFilters(filters as z.infer<typeof ldtTransactionFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof ldtTransactionFilterSchema>>
                schema={ldtTransactionFilterSchema}
                mapping={statusMapping}
                filters={ldtTransactionFilters}
                filterFields={ldtTransactionFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={ldtTransaction} columns={ldtTransactionColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LdtTransactions;