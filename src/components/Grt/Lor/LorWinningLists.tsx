import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {LorWinningListColumns} from "@/components/GenericTableColumn.tsx";
import {LorWinningList, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {lorWinningLists} from "@/services/lor_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

// Schema per le transazioni
const LorWinningListFilterSchema = z.object({
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
const LorWinningListFilterFields: FilterField<z.infer<typeof LorWinningListFilterSchema>>[] = [
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

const LorWinningLists = () => {
    const [winningLists, setWinningLists] = useState<LorWinningList[]>([]);
    const [winningListsFilters, setWinningListsFilters] = useState<z.infer<typeof LorWinningListFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [winningListsFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        lorWinningLists(winningListsFilters, currentPage, pageSize)
            .then((response: {
                winningLists: LorWinningList[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setWinningLists(response.winningLists);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in lorWinningLists:", error);
            });
    };

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", filters);
        setWinningListsFilters(filters as z.infer<typeof LorWinningListFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof LorWinningListFilterSchema>>
                schema={LorWinningListFilterSchema}
                filters={winningListsFilters}
                filterFields={LorWinningListFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={winningLists} columns={LorWinningListColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default LorWinningLists;