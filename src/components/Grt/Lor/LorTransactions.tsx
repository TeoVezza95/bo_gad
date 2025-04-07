import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorTransactionColumns, typeMapping} from "@/components/GenericTableColumn.tsx";
import {LorTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorTransactions} from "@/services/lor_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

// Schema per le transazioni
const lorTransactionFilterSchema = z.object({
    id: z.string().optional(),
    contractid: z.string().optional(),
    contestCode: z.string().optional(),
    contestType: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro per le transazioni
const lorTransactionFilterFields: FilterField<z.infer<typeof lorTransactionFilterSchema>>[] = [
    {field: "id", label: "Transazione", type: "text"},
    {field: "contractid", label: "Conto Gioco", type: "text"},
    {field: "contestCode", label: "Concorso", type: "text"},
    {
        field: "contestType", label: "Tipologia", type: "select", options: [
            {label: "10ELOTTO IMMEDIATA", value: "10ELOTTO IMMEDIATA"},
            {label: "10ELOTTO FREQUENTE", value: "10ELOTTO FREQUENTE"},
            {label: "10ELOTTO LOTTO", value: "10ELOTTO LOTTO"},
            {label: "LOTTO", value: "LOTTO"},
            {label: "MILLIONDAY", value: "MILLIONDAY"}
        ]
    },
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const LorTransactions = () => {
    const [lorTransaction, setLorTransaction] = useState<LorTransaction[]>([]);
    const [lorTransactionFilters, setLorTransactionFilters] = useState<z.infer<typeof lorTransactionFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [lorTransactionFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        lorTransactions(lorTransactionFilters, currentPage, pageSize)
            .then((response: {
                transactions: LorTransaction[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setLorTransaction(response.transactions);
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
        console.log("Filtering data lorTransactions:", {filters});
        setLorTransactionFilters(filters as z.infer<typeof lorTransactionFilterSchema>);
    };
    return (
        <>
            <GenericFilters<z.infer<typeof lorTransactionFilterSchema>>
                schema={lorTransactionFilterSchema}
                mapping={typeMapping}
                filters={lorTransactionFilters}
                filterFields={lorTransactionFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={lorTransaction} columns={lorTransactionColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LorTransactions;