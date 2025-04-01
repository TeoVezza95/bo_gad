import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ewlColumns} from "@/components/GenericTableColumn.tsx";
import {EwlTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {ewlTransactions} from "@/services/act_services.ts";

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

    useEffect(() => {
        ewlTransactions(ewlTransactionFilters)
            .then((response: EwlTransaction[]) => {
                setEwlTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ewlTransactions:", error);
            });
    }, [ewlTransactionFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "ewlTransactions",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "ewlTransactions") {
            setEwlTransactionFilters(filters as z.infer<typeof ewlTransactionFilterSchema>);
        }
    };

    return (
        <>
        <GenericFilters<z.infer<typeof ewlTransactionFilterSchema>>
            schema={ewlTransactionFilterSchema}
            filters={ewlTransactionFilters}
            filterFields={ewlTransactionFilterFields}
            onFilter={(values) => handleFilter("ewlTransactions", values)}
        />
    <GenericTable data={ewlTransaction} columns={ewlColumns}/>
        </>
    )
}
export default Ewl