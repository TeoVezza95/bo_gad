import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {onpColumns} from "@/components/GenericTableColumn.tsx";
import {OnpTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {onpTransactions} from "@/services/act_services.ts";

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

    useEffect(() => {
        onpTransactions(onpTransactionFilters)
            .then((response: OnpTransaction[]) => {
                setOnpTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in onpTransactions:", error);
            });
    }, [onpTransactionFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "onpTransactions",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "onpTransactions") {
            setOnpTransactionFilters(filters as z.infer<typeof onpTransactionFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof onpTransactionFilterSchema>>
                schema={onpTransactionFilterSchema}
                filters={onpTransactionFilters}
                filterFields={onpTransactionFilterFields}
                onFilter={(values) => handleFilter("onpTransactions", values)}
            />
            <GenericTable data={onpTransaction} columns={onpColumns}/>
        </>
    )
}
export default Onp