import {CardsContainer} from "@/components/CardsContainer.tsx";
import {useEffect, useState} from "react";
import {ActBonus, ActStorni, EwlTransaction, FilterField, OnpTransaction} from "@/interfaces.ts";
import {actBonus, actStorni, ewlTransactions, onpTransactions} from "@/services/act_services.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {
    actBonusColumns,
    actStorniColumns, ewlColumns, onpColumns,
} from "@/components/GenericTableColumn.tsx";
import {z} from "zod";
import {GenericFilters} from "@/components/GenericFilters.tsx";

const ewlTransactionFilterSchema = z.object({
    DATE_TRANSACTION: z.string().optional(),
    OPERATION_ID: z.string().optional(),
});

const onpTransactionFilterSchema = z.object({
    TRANSACTION_DATE: z.string().optional(),
    OPERATION_ID: z.string().optional(),
    CONTRACT_ID: z.string().optional(),
});

const bonusFilterSchema = z.object({
    INSERTION_DATE: z.string().optional(),
    TRANSACTION_DATE: z.string().optional(),
    OPERATION_ID: z.string().optional(),
    TEST_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
});

const storniFilterSchema = z.object({
    INSERTION_DATE: z.string().optional(),
    TRANSACTION_DATE: z.string().optional(),
    OPERATION_ID: z.string().optional(),
});

// Definizione dei campi filtro per le transazioni
const ewlTransactionFilterFields: FilterField<z.infer<typeof ewlTransactionFilterSchema>>[] = [
    {field: "DATE_TRANSACTION", label: "Data", type: "date"},
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
];

// Definizione dei campi filtro per le transazioni
const onpTransactionFilterFields: FilterField<z.infer<typeof onpTransactionFilterSchema>>[] = [
    {field: "TRANSACTION_DATE", label: "Data", type: "date"},
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
    {field: "CONTRACT_ID", label: "Conto Gioco", type: "text"},
];

const bonusFilterFields: FilterField<z.infer<typeof bonusFilterSchema>>[] = [
    {field: "TRANSACTION_DATE", label: "Data Transazione", type: "date"},
    {field: "INSERTION_DATE", label: "Data Inserimento", type: "date"},
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
    {field: "TEST_RANGE", label: "Data Test", type: "daterange"},
]

const storniFilterFields: FilterField<z.infer<typeof storniFilterSchema>>[] = [
    {field: "TRANSACTION_DATE", label: "Data Transazione", type: "date"},
    {field: "INSERTION_DATE", label: "Data Inserimento", type: "date"},
    {field: "OPERATION_ID", label: "Operazione", type: "text"},
]

const ActPage = () => {
    const [ewlTransaction, setEwlTransaction] = useState<EwlTransaction[]>([]);
    const [ewlTransactionFilters, setEwlTransactionFilters] = useState<z.infer<typeof ewlTransactionFilterSchema>>({});
    const [onpTransaction, setOnpTransaction] = useState<OnpTransaction[]>([]);
    const [onpTransactionFilters, setOnpTransactionFilters] = useState<z.infer<typeof onpTransactionFilterSchema>>({});
    const [bonus, setBonus] = useState<ActBonus[]>([])
    const [bonusFilters, setBonusFilters] = useState<z.infer<typeof bonusFilterSchema>>({});
    const [storni, setStorni] = useState<ActStorni[]>([])
    const [storniFilters, setStorniFilters] = useState<z.infer<typeof storniFilterSchema>>({});


    useEffect(() => {
        ewlTransactions(ewlTransactionFilters)
            .then((response: EwlTransaction[]) => {
                setEwlTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ewlTransactions:", error);
            });
    }, [ewlTransactionFilters]);

    useEffect(() => {
        onpTransactions(onpTransactionFilters)
            .then((response: OnpTransaction[]) => {
                setOnpTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in onpTransactions:", error);
            });
    }, [onpTransactionFilters]);

    useEffect(() => {
        actBonus(bonusFilters)
            .then((response: ActBonus[]) => {
                setBonus(response);
            })
            .catch((error: unknown) => {
                console.error("Error in act bonus:", error);
            });
    }, [bonusFilters]);

    useEffect(() => {
        actStorni(storniFilters)
            .then((response: ActStorni[]) => {
                setStorni(response);
            })
            .catch((error: unknown) => {
                console.error("Error in act storni:", error);
            });
    }, [storniFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "ewlTransactions" | "onpTransactions" | "bonus" | "storni",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", {type, filters});

        if (type === "ewlTransactions") {
            setEwlTransactionFilters(filters as z.infer<typeof ewlTransactionFilterSchema>);
        } else if (type === "onpTransactions") {
            setOnpTransactionFilters(filters as z.infer<typeof onpTransactionFilterSchema>);
        } else if (type === "bonus") {
            setBonusFilters(filters as z.infer<typeof bonusFilterSchema>);
        } else if (type === "storni") {
            setStorniFilters(filters as z.infer<typeof storniFilterSchema>);
        }
    };

    console.log("test ewl transaction", ewlTransaction);
    console.log("test onp transaction", onpTransaction);
    console.log("test act bonus", bonus);
    console.log("test act storni", storni);

    const data = [
        {title: "Giocate", value: "431.500"},
        {title: "BounceRate", value: "53%"},
        {title: "Registrazioni oggi", value: "1.355"},
        {title: "Visitatori", value: "45.000"},
    ]


    return (
        <>
            <div className="size-full">
                ACT
            </div>
            <CardsContainer items={data}/>
            <Tabs defaultValue="bonus">
                <TabsList>
                    <TabsTrigger value="bonus">Bonus</TabsTrigger>
                    <TabsTrigger value="storni">Storni</TabsTrigger>
                    <TabsTrigger value="onp">Coda - ONP</TabsTrigger>
                    <TabsTrigger value="ewl">Coda - EWL</TabsTrigger>
                </TabsList>
                <TabsContent value="bonus">
                    <GenericFilters<z.infer<typeof bonusFilterSchema>>
                        schema={bonusFilterSchema}
                        filters={bonusFilters}
                        filterFields={bonusFilterFields}
                        onFilter={(values) => handleFilter("bonus", values)}
                    />
                    <GenericTable data={bonus} columns={actBonusColumns}/>
                </TabsContent>
                <TabsContent value="storni">
                    <GenericFilters<z.infer<typeof storniFilterSchema>>
                        schema={storniFilterSchema}
                        filters={storniFilters}
                        filterFields={storniFilterFields}
                        onFilter={(values) => handleFilter("storni", values)}
                    />
                    <GenericTable data={storni} columns={actStorniColumns}/>
                </TabsContent>
                <TabsContent value="onp">
                    <GenericFilters<z.infer<typeof onpTransactionFilterSchema>>
                        schema={onpTransactionFilterSchema}
                        filters={onpTransactionFilters}
                        filterFields={onpTransactionFilterFields}
                        onFilter={(values) => handleFilter("onpTransactions", values)}
                    />
                    <GenericTable data={onpTransaction} columns={onpColumns}/>
                </TabsContent>
                <TabsContent value="ewl">
                    <GenericFilters<z.infer<typeof ewlTransactionFilterSchema>>
                        schema={ewlTransactionFilterSchema}
                        filters={ewlTransactionFilters}
                        filterFields={ewlTransactionFilterFields}
                        onFilter={(values) => handleFilter("ewlTransactions", values)}
                    />
                    <GenericTable data={ewlTransaction} columns={ewlColumns}/>
                </TabsContent>
            </Tabs>
        </>
    )
}

export default ActPage
