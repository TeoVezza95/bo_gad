import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {actBonusColumns} from "@/components/GenericTableColumn.tsx";
import {ActBonus, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import PaginationControls from "@/components/PaginatorControls.tsx";
import {actBonus} from "@/services/act_services.ts";

const bonusFilterSchema = z.object({
    OPERATION_ID: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

const bonusFilterFields: FilterField<z.infer<typeof bonusFilterSchema>>[] = [
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
]

const Bonus = () => {
    const [bonus, setBonus] = useState<ActBonus[]>([]);
    const [bonusFilters, setBonusFilters] = useState<z.infer<typeof bonusFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [bonusFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        actBonus(bonusFilters, currentPage, pageSize)
            .then((response: {
                actBonus: ActBonus[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setBonus(response.actBonus);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in bonuss:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data bonus:", filters);
        setBonusFilters(filters as z.infer<typeof bonusFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof bonusFilterSchema>>
                schema={bonusFilterSchema}
                filters={bonusFilters}
                filterFields={bonusFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={bonus} columns={actBonusColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default Bonus