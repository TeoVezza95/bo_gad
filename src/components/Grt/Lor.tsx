import {CardsContainer} from "@/components/CardsContainer.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {
    lorContestColumns,
    lorRegistryKeyColumns,
    lorTransactionColumns,
    lorWinningListsColumns
} from "@/components/GenericTableColumn.tsx";
import {useEffect, useState} from "react";
import {FilterField, LorContest, LorRegistryKey, LorTransaction, LorWinning} from "@/interfaces.ts";
import {lorContests, lorRegistryKeys, lorTransactions, lorWinningLists} from "@/services/lor_services.ts";
import {z} from "zod";
import {GenericFilters} from "@/components/GenericFilters.tsx";

// Schema per le transazioni
const transactionFilterSchema = z.object({
    id: z.string().optional(),
    contractid: z.string().optional(),
    wagerDate: z.string().optional(),
    contestCode: z.string().optional(),
    contestType: z.string().optional(),
});

// Schema per le registry keys
const registryKeysFilterSchema = z.object({
    contractId: z.string().optional(),
});

const contestsFilterSchema = z.object({
    contestType: z.string().optional(),
    contestCode: z.string().optional(),
});

const winningListsFilterSchema = z.object({
    contestType: z.string().optional(),
    contestCode: z.string().optional(),
    communicationDate: z.string().optional(),
    processed: z.string().optional(),
    notified: z.string().optional(),
});

// Definizione dei campi filtro per le transazioni
const transactionFilterFields: FilterField<z.infer<typeof transactionFilterSchema>>[] = [
    {field: "id", label: "Transazione", type: "text"},
    {field: "contractid", label: "Conto Gioco", type: "text"},
    {field: "wagerDate", label: "Data", type: "date"},
    {field: "contestCode", label: "Concorso", type: "text"},
    {field: "contestType", label: "Tipologia", type: "text"},
];

// Definizione dei campi filtro per le registry keys
const registryKeysFilterFields: FilterField<z.infer<typeof registryKeysFilterSchema>>[] = [
    {field: "contractId", label: "Conto Gioco", type: "text"},
];

const contestsFilterFields: FilterField<z.infer<typeof contestsFilterSchema>>[] = [
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
]

const winningListsFilterFields: FilterField<z.infer<typeof winningListsFilterSchema>>[] = [
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
    {field: "communicationDate", label: "Data Comunicazione", type: "date"},
    {field: "notified", label: "Notificata", type: "text"},
    {field: "processed", label: "Processato", type: "text"},
]

const Lor = () => {
    const [transaction, setTransaction] = useState<LorTransaction[]>([]);
    const [transactionFilters, setTransactionFilters] = useState<z.infer<typeof transactionFilterSchema>>({});
    const [registryKeys, setRegistryKeys] = useState<LorRegistryKey[]>([]);
    const [registryKeysFilters, setRegistryKeysFilters] = useState<z.infer<typeof registryKeysFilterSchema>>({});
    const [contests, setContests] = useState<LorContest[]>([]);
    const [contestsFilters, setContestsFilters] = useState<z.infer<typeof contestsFilterSchema>>({});
    const [winningLists, setWinningLists] = useState<LorWinning[]>([]);
    const [winningListsFilters, setWinningListsFilters] = useState<z.infer<typeof winningListsFilterSchema>>({});


    const data = [
        {title: "Transazioni", value: "5600"},
        {title: "Completate", value: "2300"},
        {title: "Annullate", value: "650"},
        {title: "Pending", value: "4650"},
    ];

    useEffect(() => {
        lorTransactions(transactionFilters)
            .then((response: LorTransaction[]) => {
                console.log("test lor trans", response);
                setTransaction(response);
            })
            .catch((error: unknown) => {
                console.error("Error in lorTransaction:", error);
            });
        // Se vuoi eseguire l'effetto una sola volta, usa un array di dipendenze vuoto
    }, [transactionFilters]);

    useEffect(() => {
        lorRegistryKeys(registryKeysFilters)
            .then((response: LorRegistryKey[]) => {
                console.log("test lor registry keys", response);
                setRegistryKeys(response);
            })
            .catch((error: unknown) => {
                console.error("Error in lorRegistryKeys:", error);
            });
        // Anche qui, valuta se usare un array di dipendenze vuoto
    }, [registryKeysFilters]);

    useEffect(() => {
        lorContests(contestsFilters)
            .then((response: LorContest[]) => {
                console.log("test lor contests", response);
                setContests(response);
            })
            .catch((error: unknown) => {
                console.error("Error in lorContests:", error);
            });
        // Anche qui, valuta se usare un array di dipendenze vuoto
    }, [contestsFilters]);

    useEffect(() => {
        lorWinningLists(winningListsFilters)
            .then((response: LorWinning[]) => {
                console.log("test lor winning lists", response);
                setWinningLists(response);
            })
            .catch((error: unknown) => {
                console.error("Error in lorTransaction:", error);
            });
        // Se vuoi eseguire l'effetto una sola volta, usa un array di dipendenze vuoto
    }, [winningListsFilters]);

    // Funzione per filtrare i dati in base al tipo
    const handleFilter = (
        type: "transactions" | "registryKeys" | "contests" | "winningLists",
        filters: Record<string, unknown> // Generalizzato per gestire entrambi gli schema
    ) => {
        console.log("Filtering data:", { type, filters });

        if (type === "transactions") {
            setTransactionFilters(filters as z.infer<typeof transactionFilterSchema>);
        } else if (type === "registryKeys") {
            setRegistryKeysFilters(filters as z.infer<typeof registryKeysFilterSchema>);
        }else if (type === "contests") {
            setContestsFilters(filters as z.infer<typeof contestsFilterSchema>);
        }else if (type === "winningLists") {
            setWinningListsFilters(filters as z.infer<typeof winningListsFilterSchema>);
        }
    };

    return (
        <>
            <CardsContainer items={data} cardClass={"bg-[#f58220] text-white"}/>
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transazioni</TabsTrigger>
                    <TabsTrigger value="registryKeys">Conti Registrati</TabsTrigger>
                    <TabsTrigger value="contests">Concorsi</TabsTrigger>
                    <TabsTrigger value="winningLists">Giocate Vincenti</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <GenericFilters<z.infer<typeof transactionFilterSchema>>
                        schema={transactionFilterSchema}
                        filters={transactionFilters}
                        filterFields={transactionFilterFields}
                        onFilter={(values) => handleFilter("transactions", values)}
                    />
                    <GenericTable data={transaction} columns={lorTransactionColumns}/>
                </TabsContent>
                <TabsContent value="registryKeys">
                    <GenericFilters<z.infer<typeof registryKeysFilterSchema>>
                        schema={registryKeysFilterSchema}
                        filters={registryKeysFilters}
                        filterFields={registryKeysFilterFields}
                        onFilter={(values) => handleFilter("registryKeys", values)}
                    />
                    <GenericTable data={registryKeys} columns={lorRegistryKeyColumns}/>
                </TabsContent>
                <TabsContent value="contests">
                    <GenericFilters<z.infer<typeof contestsFilterSchema>>
                        schema={contestsFilterSchema}
                        filters={contestsFilters}
                        filterFields={contestsFilterFields}
                        onFilter={(values) => handleFilter("contests", values)}
                    />
                    <GenericTable data={contests} columns={lorContestColumns}/>
                </TabsContent>
                <TabsContent value="winningLists">
                    <GenericFilters<z.infer<typeof winningListsFilterSchema>>
                        schema={winningListsFilterSchema}
                        filters={winningListsFilters}
                        filterFields={winningListsFilterFields}
                        onFilter={(values) => handleFilter("winningLists", values)}
                    />
                    <GenericTable data={winningLists} columns={lorWinningListsColumns}/>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default Lor;
