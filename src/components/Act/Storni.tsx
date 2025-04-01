import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {actStorniColumns} from "@/components/GenericTableColumn.tsx";
import {ActStorni, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {actStorni} from "@/services/act_services.ts";

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

    useEffect(() => {
        actStorni(storniFilters)
            .then((response: ActStorni[]) => {
                setStorni(response);
            })
            .catch((error: unknown) => {
                console.error("Error in actStorni:", error);
            });
    }, [storniFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "actStorni",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "actStorni") {
            setStorniFilters(filters as z.infer<typeof storniFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof storniFilterSchema>>
                schema={storniFilterSchema}
                filters={storniFilters}
                filterFields={storniFilterFields}
                onFilter={(values) => handleFilter("actStorni", values)}
            />
            <GenericTable data={storni} columns={actStorniColumns}/>
        </>
    )
}
export default Storni