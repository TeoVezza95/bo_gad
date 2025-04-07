import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {gevTransactionColumns, statusMapping} from "@/components/GenericTableColumn.tsx";
import {GevTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {gevTransactions} from "@/services/gev_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

// Schema per le transazioni
const gevTransactionFilterSchema = z.object({
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
const gevTransactionFilterFields: FilterField<z.infer<typeof gevTransactionFilterSchema>>[] = [
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

const GevTransactions = () => {
    const [gevTransaction, setGevTransaction] = useState<GevTransaction[]>([]);
    const [gevTransactionFilters, setGevTransactionFilters] = useState<z.infer<typeof gevTransactionFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [gevTransactionFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        gevTransactions(gevTransactionFilters, currentPage, pageSize)
            .then((response: {
                transactions: GevTransaction[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setGevTransaction(response.transactions);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in gevTransactions:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data gevTransactions:", filters);
        setGevTransactionFilters(filters as z.infer<typeof gevTransactionFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof gevTransactionFilterSchema>>
                schema={gevTransactionFilterSchema}
                filters={gevTransactionFilters}
                mapping={statusMapping}
                filterFields={gevTransactionFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={gevTransaction} columns={gevTransactionColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default GevTransactions;