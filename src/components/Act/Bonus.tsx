import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {actBonusColumns} from "@/components/GenericTableColumn.tsx";
import {ActBonus, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
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

    useEffect(() => {
        actBonus(bonusFilters)
            .then((response: ActBonus[]) => {
                setBonus(response);
            })
            .catch((error: unknown) => {
                console.error("Error in actBonus:", error);
            });
    }, [bonusFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "actBonus",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});
        if (type === "actBonus") {
            setBonusFilters(filters as z.infer<typeof bonusFilterSchema>);
        }
    };

    return (
        <>
            <GenericFilters<z.infer<typeof bonusFilterSchema>>
                schema={bonusFilterSchema}
                filters={bonusFilters}
                filterFields={bonusFilterFields}
                onFilter={(values) => handleFilter("actBonus", values)}
            />
            <GenericTable data={bonus} columns={actBonusColumns}/>
        </>
    )
}
export default Bonus