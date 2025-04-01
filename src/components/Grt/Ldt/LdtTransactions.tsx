import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ldtTransactionColumns} from "@/components/GenericTableColumn.tsx";
import {LdtTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {ldtTransactions} from "@/services/ldt_services.ts";

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

    useEffect(() => {
        ldtTransactions(ldtTransactionFilters)
            .then((response: LdtTransaction[]) => {
                setLdtTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtTransactions:", error);
            });
    }, [ldtTransactionFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "ldtTransactions",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "ldtTransactions") {
            setLdtTransactionFilters(filters as z.infer<typeof ldtTransactionFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof ldtTransactionFilterSchema>>
                schema={ldtTransactionFilterSchema}
                filters={ldtTransactionFilters}
                filterFields={ldtTransactionFilterFields}
                onFilter={(values) => handleFilter("ldtTransactions", values)}
            />
            <GenericTable data={ldtTransaction} columns={ldtTransactionColumns}/>
        </>
    )
}
export default LdtTransactions;