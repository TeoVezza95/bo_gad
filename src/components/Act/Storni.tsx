import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {actStorniColumns} from "@/components/GenericTableColumn.tsx";
import {ActStorni, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {actStorni} from "@/services/act_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";

const storniFilterSchema = z.object({
    OPERATION_ID: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

const storniFilterFields: FilterField<z.infer<typeof storniFilterSchema>>[] = [
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
]

const Storni = () => {
    const [storni, setStorni] = useState<ActStorni[]>([]);
    const [storniFilters, setStorniFilters] = useState<z.infer<typeof storniFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [storniFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        actStorni(storniFilters, currentPage, pageSize)
            .then((response: {
                actStorni: ActStorni[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setStorni(response.actStorni);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in stornis:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data storni:", filters);
        setStorniFilters(filters as z.infer<typeof storniFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof storniFilterSchema>>
                schema={storniFilterSchema}
                filters={storniFilters}
                filterFields={storniFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={storni} columns={actStorniColumns}/>
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default Storni