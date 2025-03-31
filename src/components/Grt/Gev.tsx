import { CardsContainer } from "@/components/CardsContainer.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { GenericTable } from "@/components/GenericTable.tsx";
import { gevRegistryKeyColumns, gevTransactionColumns } from "@/components/GenericTableColumn.tsx";
import { useEffect, useState } from "react";
import { gevRegistryKeys, gevTransactions } from "@/services/gev_services.ts";
import { FilterField, GevRegistryKey, GevTransaction } from "@/interfaces.ts";
import { GenericFilters } from "@/components/GenericFilters.tsx";
import { z } from "zod";

// Schema per le transazioni
const transactionFilterSchema = z.object({
    id: z.string().optional(),
    contractid: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.string().optional(),
});

// Schema per le registry keys
const registryKeysFilterSchema = z.object({
    clientIp: z.string().optional(),
    contractId: z.string().optional(),
    registrationDate: z.string().optional(),
});

// Definizione dei campi filtro per le transazioni
const transactionFilterFields: FilterField<z.infer<typeof transactionFilterSchema>>[] = [
    { field: "id", label: "Transazione", type: "text" },
    { field: "contractid", label: "Conto Gioco", type: "text" },
    { field: "startDate", label: "Data Inizio", type: "date" },
    { field: "endDate", label: "Data Fine", type: "date" },
    {
        field: "status",
        label: "Stato",
        type: "select",
        options: [
            { label: "Prenotata", value: "1" },
            { label: "Completata", value: "2" },
            { label: "Annullata", value: "3" },
        ],
    },
];

// Definizione dei campi filtro per le registry keys
const registryKeysFilterFields: FilterField<z.infer<typeof registryKeysFilterSchema>>[] = [
    { field: "contractId", label: "Conto Gioco", type: "text" },
    { field: "registrationDate", label: "Data Registrazione", type: "date" },
];

const Gev = () => {
    const [transaction, setTransaction] = useState<GevTransaction[]>([]);
    const [transactionFilters, setTransactionFilters] = useState<z.infer<typeof transactionFilterSchema>>({});
    const [registryKeys, setRegistryKeys] = useState<GevRegistryKey[]>([]);
    const [registryKeysFilters, setRegistryKeysFilters] = useState<z.infer<typeof registryKeysFilterSchema>>({});

    const data = [
        { title: "Transazioni", value: "51500" },
        { title: "Completate", value: "14000" },
        { title: "Annullate", value: "1300" },
        { title: "Pending", value: "450" },
    ];

    useEffect(() => {
        gevTransactions(transactionFilters)
            .then((response: GevTransaction[]) => {
                console.log("test gev trans", response);
                setTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in gevTransactions:", error);
            });
    }, [transactionFilters]);

    useEffect(() => {
        gevRegistryKeys(registryKeysFilters)
            .then((response: GevRegistryKey[]) => {
                console.log("test gev registry keys", response);
                setRegistryKeys(response);
            })
            .catch((error: unknown) => {
                console.error("Error in gevRegistryKeys:", error);
            });
    }, [registryKeysFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "transactions" | "registryKeys",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", { type, filters });

        if (type === "transactions") {
            setTransactionFilters(filters as z.infer<typeof transactionFilterSchema>);
        } else if (type === "registryKeys") {
            setRegistryKeysFilters(filters as z.infer<typeof registryKeysFilterSchema>);
        }
    };

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-yellow-300 text-gadBlue"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                    <TabsTrigger value="registryKeys">Conti Registrati</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <GenericFilters<z.infer<typeof transactionFilterSchema>>
                        schema={transactionFilterSchema}
                        filters={transactionFilters}
                        filterFields={transactionFilterFields}
                        onFilter={(values) => handleFilter("transactions", values)}
                    />
                    <GenericTable data={transaction} columns={gevTransactionColumns} />
                </TabsContent>
                <TabsContent value="registryKeys">
                    <GenericFilters<z.infer<typeof registryKeysFilterSchema>>
                        schema={registryKeysFilterSchema}
                        filters={registryKeysFilters}
                        filterFields={registryKeysFilterFields}
                        onFilter={(values) => handleFilter("registryKeys", values)}
                    />
                    <GenericTable data={registryKeys} columns={gevRegistryKeyColumns} />
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Gev;
