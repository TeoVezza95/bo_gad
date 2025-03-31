import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ldtContestColumns, ldtRegistryKeyColumns, ldtTransactionColumns} from "@/components/GenericTableColumn.tsx";
import {useEffect, useState} from "react";
import {FilterField, LdtContest, LdtRegistryKey, LdtTransaction} from "@/interfaces.ts";
import {ldtContests, ldtRegistryKeys, ldtTransactions} from "@/services/ldt_services.ts";
import { z } from "zod";
import {GenericFilters} from "@/components/GenericFilters.tsx";

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
    contractId: z.string().optional(),
    registrationDate: z.string().optional(),
});

const contestsFilterSchema = z.object({
    gameId: z.string().optional(),
    gameChannel: z.string().optional(),
    status: z.string().optional(),
    lotteryId: z.string().optional(),
    insertDate: z.string().optional(),
    updateDate: z.string().optional(),
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

const contestsFilterFields: FilterField<z.infer<typeof contestsFilterSchema>>[] = [
    {field: "gameId", label: "ID", type: "text" },
    { field: "gameChannel", label: "Canale", type: "text" },
    {
        field: "status",
        label: "Stato",
        type: "select",
        options: [
            { label: "Aperto", value: "A" },
            { label: "Chiuso", value: "C" },
            { label: "Sospeso", value: "S" },
        ],
    },
    { field: "insertDate", label: "Data Censimento", type: "date" },
    { field: "updateDate", label: "Data Aggiornamento", type: "date" },
]

const Ldt = () => {
    const [transaction, setTransaction] = useState<LdtTransaction[]>([]);
    const [transactionFilters, setTransactionFilters] = useState<z.infer<typeof transactionFilterSchema>>({});
    const [registryKeys, setRegistryKeys] = useState<LdtRegistryKey[]>([]);
    const [registryKeysFilters, setRegistryKeysFilters] = useState<z.infer<typeof registryKeysFilterSchema>>({});
    const [contests, setContests] = useState<LdtContest[]>([]);
    const [contestsFilters, setContestsFilters] = useState<z.infer<typeof contestsFilterSchema>>({});



    const data = [
        {title: "Transazioni", value: "4500"},
        {title: "Completate", value: "1200"},
        {title: "Annullate", value: "100"},
        {title: "Pending", value: "410"},
    ];

    useEffect(() => {
        ldtTransactions(transactionFilters)
            .then((response: LdtTransaction[]) => {
                console.log("test ldt trans", response);
                setTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtTransaction:", error);
            });
        // Se vuoi eseguire l'effetto una sola volta, usa un array di dipendenze vuoto
    }, [transactionFilters]);

    useEffect(() => {
        ldtRegistryKeys(registryKeysFilters)
            .then((response: LdtRegistryKey[]) => {
                console.log("test ldt registry keys", response);
                setRegistryKeys(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtRegistryKeys:", error);
            });
        // Anche qui, valuta se usare un array di dipendenze vuoto
    }, [registryKeysFilters]);

    useEffect(() => {
        ldtContests(contestsFilters)
            .then((response: LdtContest[]) => {
                console.log("test ldt contests", response);
                setContests(response);
            })
            .catch((error: unknown) => {
                console.error("Error in ldtContests:", error);
            });
        // Anche qui, valuta se usare un array di dipendenze vuoto
    }, [contestsFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "transactions" | "registryKeys" | "contests",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", { type, filters });

        if (type === "transactions") {
            setTransactionFilters(filters as z.infer<typeof transactionFilterSchema>);
        } else if (type === "registryKeys") {
            setRegistryKeysFilters(filters as z.infer<typeof registryKeysFilterSchema>);
        }else if (type === "contests") {
            setContestsFilters(filters as z.infer<typeof contestsFilterSchema>);
        }
    };

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-gadBlue text-yellow-300"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                    <TabsTrigger value="registryKeys">Conti Registrati</TabsTrigger>
                    <TabsTrigger value="contests">Concorsi</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <GenericFilters<z.infer<typeof transactionFilterSchema>>
                        schema={transactionFilterSchema}
                        filters={transactionFilters}
                        filterFields={transactionFilterFields}
                        onFilter={(values) => handleFilter("transactions", values)}
                    />
                    <GenericTable data={transaction} columns={ldtTransactionColumns}/>
                </TabsContent>
                <TabsContent value="registryKeys">
                    <GenericFilters<z.infer<typeof registryKeysFilterSchema>>
                        schema={registryKeysFilterSchema}
                        filters={registryKeysFilters}
                        filterFields={registryKeysFilterFields}
                        onFilter={(values) => handleFilter("registryKeys", values)}
                    />
                    <GenericTable data={registryKeys} columns={ldtRegistryKeyColumns}/>
                </TabsContent>
                <TabsContent value="contests">
                    <GenericFilters<z.infer<typeof contestsFilterSchema>>
                        schema={contestsFilterSchema}
                        filters={contestsFilters}
                        filterFields={contestsFilterFields}
                        onFilter={(values) => handleFilter("contests", values)}
                    />
                    <GenericTable data={contests} columns={ldtContestColumns}/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Ldt;
