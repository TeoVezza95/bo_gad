import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ldtContestColumns} from "@/components/GenericTableColumn.tsx";
import {LdtContest, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {ldtContests} from "@/services/ldt_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

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
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [ldtContestFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        ldtContests(ldtContestFilters, currentPage, pageSize)
            .then((response: {
                contests: LdtContest[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setLdtContest(response.contests);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtTransactions:", error);
            });
    };

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data ldtContests:", filters);
        setLdtContestFilters(filters as z.infer<typeof ldtContestFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof ldtContestFilterSchema>>
                schema={ldtContestFilterSchema}
                filters={ldtContestFilters}
                filterFields={ldtContestFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={ldtContest} columns={ldtContestColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LdtContests;