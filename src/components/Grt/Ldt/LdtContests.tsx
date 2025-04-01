import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ldtContestColumns} from "@/components/GenericTableColumn.tsx";
import {LdtContest, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {ldtContests} from "@/services/ldt_services.ts";

// Schema per le transazioni
const ldtContestFilterSchema = z.object({
    gameId: z.string().optional(),
    gameChannel: z.string().optional(),
    status: z.string().optional(),
    lotteryId: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro per le transazioni
const ldtContestFilterFields: FilterField<z.infer<typeof ldtContestFilterSchema>>[] = [
    {field: "gameId", label: "ID", type: "text"},
    {field: "gameChannel", label: "Canale", type: "text"},
    {
        field: "status",
        label: "Stato",
        type: "select",
        options: [
            {label: "Aperto", value: "A"},
            {label: "Chiuso", value: "C"},
            {label: "Sospeso", value: "S"},
        ],
    },
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const LdtContests = () => {
    const [ldtContest, setLdtContest] = useState<LdtContest[]>([]);
    const [ldtContestFilters, setLdtContestFilters] = useState<z.infer<typeof ldtContestFilterSchema>>({});

    useEffect(() => {
        ldtContests(ldtContestFilters)
            .then((response: LdtContest[]) => {
                setLdtContest(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtContests:", error);
            });
    }, [ldtContestFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "ldtContests",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "ldtContests") {
            setLdtContestFilters(filters as z.infer<typeof ldtContestFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof ldtContestFilterSchema>>
                schema={ldtContestFilterSchema}
                filters={ldtContestFilters}
                filterFields={ldtContestFilterFields}
                onFilter={(values) => handleFilter("ldtContests", values)}
            />
            <GenericTable data={ldtContest} columns={ldtContestColumns}/>
        </>
    )
}
export default LdtContests;