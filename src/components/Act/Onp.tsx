import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {onpColumns} from "@/components/GenericTableColumn.tsx";
import {OnpTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {onpTransactions} from "@/services/act_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

const onpTransactionFilterSchema = z.object({
    OPERATION_ID: z.string().optional(),
    CONTRACT_ID: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro per le transazioni
const onpTransactionFilterFields: FilterField<z.infer<typeof onpTransactionFilterSchema>>[] = [
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
    {field: "CONTRACT_ID", label: "Conto Gioco", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const Onp = () => {
    const [onpTransaction, setOnpTransaction] = useState<OnpTransaction[]>([]);
    const [onpTransactionFilters, setOnpTransactionFilters] = useState<z.infer<typeof onpTransactionFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [onpTransactionFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        onpTransactions(onpTransactionFilters, currentPage, pageSize)
            .then((response: {
                transactions: OnpTransaction[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setOnpTransaction(response.transactions);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in onpTransactions:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data onpTransactions:", filters);
        setOnpTransactionFilters(filters as z.infer<typeof onpTransactionFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof onpTransactionFilterSchema>>
                schema={onpTransactionFilterSchema}
                filters={onpTransactionFilters}
                filterFields={onpTransactionFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={onpTransaction} columns={onpColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default Onp