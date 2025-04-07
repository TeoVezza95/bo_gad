import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorContestColumns, typeMapping} from "@/components/GenericTableColumn.tsx";
import {LorContest, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorContests} from "@/services/lor_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

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
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [lorContestFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        lorContests(lorContestFilters, currentPage, pageSize)
            .then((response: {
                contests: LorContest[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setLorContest(response.contests);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in lorTransactions:", error);
            });
    };

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data lorContests:", filters);
        setLorContestFilters(filters as z.infer<typeof lorContestFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof lorContestFilterSchema>>
                schema={lorContestFilterSchema}
                mapping={typeMapping}
                filters={lorContestFilters}
                filterFields={lorContestFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={lorContest} columns={lorContestColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LorContests;