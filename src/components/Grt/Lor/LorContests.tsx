import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorContestColumns} from "@/components/GenericTableColumn.tsx";
import {LorContest, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorContests} from "@/services/lor_services.ts";

// Schema per le transazioni
const lorContestFilterSchema = z.object({
    contestType: z.string().optional(),
    contestCode: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

// Definizione dei campi filtro per le transazioni
const lorContestFilterFields: FilterField<z.infer<typeof lorContestFilterSchema>>[] = [
    {field: "contestCode", label: "Concorso", type: "text"},
    {
        field: "contestType",
        label: "Tipologia",
        type: "select",
        options: [
            {label: "10ELOTTO IMMEDIATA", value: "10ELOTTO IMMEDIATA"},
            {label: "10ELOTTO FREQUENTE", value: "10ELOTTO FREQUENTE"},
            {label: "10ELOTTO LOTTO", value: "10ELOTTO LOTTO"},
            {label: "LOTTO", value: "LOTTO"},
            {label: "MILLIONDAY", value: "MILLIONDAY"}
        ],
    },
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
];

const LorContests = () => {
    const [lorContest, setLorContest] = useState<LorContest[]>([]);
    const [lorContestFilters, setLorContestFilters] = useState<z.infer<typeof lorContestFilterSchema>>({});

    useEffect(() => {
        lorContests(lorContestFilters)
            .then((response: LorContest[]) => {
                setLorContest(response);
            })
            .catch((error: unknown) => {
                console.error("Error in lorContests:", error);
            });
    }, [lorContestFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "lorContests",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "lorContests") {
            setLorContestFilters(filters as z.infer<typeof lorContestFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof lorContestFilterSchema>>
                schema={lorContestFilterSchema}
                filters={lorContestFilters}
                filterFields={lorContestFilterFields}
                onFilter={(values) => handleFilter("lorContests", values)}
            />
            <GenericTable data={lorContest} columns={lorContestColumns}/>
        </>
    )
}
export default LorContests;