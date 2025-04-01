import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {gevTransactionColumns} from "@/components/GenericTableColumn.tsx";
import {GevTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {gevTransactions} from "@/services/gev_services.ts";

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

    useEffect(() => {
        gevTransactions(gevTransactionFilters)
            .then((response: GevTransaction[]) => {
                setGevTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in gevTransactions:", error);
            });
    }, [gevTransactionFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "gevTransactions",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "gevTransactions") {
            setGevTransactionFilters(filters as z.infer<typeof gevTransactionFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof gevTransactionFilterSchema>>
                schema={gevTransactionFilterSchema}
                filters={gevTransactionFilters}
                filterFields={gevTransactionFilterFields}
                onFilter={(values) => handleFilter("gevTransactions", values)}
            />
            <GenericTable data={gevTransaction} columns={gevTransactionColumns}/>
        </>
    )
}
export default GevTransactions;