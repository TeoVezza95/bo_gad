import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorTransactionColumns} from "@/components/GenericTableColumn.tsx";
import {LorTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorTransactions} from "@/services/lor_services.ts";

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
    {field: "contestType", label: "Tipologia", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const LorTransactions = () => {
    const [lorTransaction, setLorTransaction] = useState<LorTransaction[]>([]);
    const [lorTransactionFilters, setLorTransactionFilters] = useState<z.infer<typeof lorTransactionFilterSchema>>({});

    useEffect(() => {
        lorTransactions(lorTransactionFilters)
            .then((response: LorTransaction[]) => {
                setLorTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in lorTransactions:", error);
            });
    }, [lorTransactionFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "lorTransactions",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "lorTransactions") {
            setLorTransactionFilters(filters as z.infer<typeof lorTransactionFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof lorTransactionFilterSchema>>
                schema={lorTransactionFilterSchema}
                filters={lorTransactionFilters}
                filterFields={lorTransactionFilterFields}
                onFilter={(values) => handleFilter("lorTransactions", values)}
            />
            <GenericTable data={lorTransaction} columns={lorTransactionColumns}/>
        </>
    )
}
export default LorTransactions;