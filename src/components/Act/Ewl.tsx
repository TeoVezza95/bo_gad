import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ewlColumns} from "@/components/GenericTableColumn.tsx";
import {EwlTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {ewlTransactions} from "@/services/act_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

const ewlTransactionFilterSchema = z.object({
    OPERATION_ID: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro per le transazioni
const ewlTransactionFilterFields: FilterField<z.infer<typeof ewlTransactionFilterSchema>>[] = [
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const Ewl = () => {
    const [ewlTransaction, setEwlTransaction] = useState<EwlTransaction[]>([]);
    const [ewlTransactionFilters, setEwlTransactionFilters] = useState<z.infer<typeof ewlTransactionFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [ewlTransactionFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        ewlTransactions(ewlTransactionFilters, currentPage, pageSize)
            .then((response: {
                transactions: EwlTransaction[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setEwlTransaction(response.transactions);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in ewlTransactions:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data ewlTransactions:", filters);
        setEwlTransactionFilters(filters as z.infer<typeof ewlTransactionFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof ewlTransactionFilterSchema>>
                schema={ewlTransactionFilterSchema}
                filters={ewlTransactionFilters}
                filterFields={ewlTransactionFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={ewlTransaction} columns={ewlColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default Ewl