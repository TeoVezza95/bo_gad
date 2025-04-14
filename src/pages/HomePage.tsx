import { useEffect, useState } from "react";
import { CardsContainer } from "@/components/CardsContainer.tsx";
import { TestChart } from "@/components/TestChart.tsx";
import {gevTransactionSummary, lorTransactionSummary} from "@/services/gev_services.ts";
import {ldtTransactionSummary} from "@/services/ldt_services.ts";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {sacsServiceOperationsColumns} from "@/components/GenericTableColumn.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {SacsServiceOperation} from "@/interfaces.ts";

// Definizione del tipo per gli elementi delle transazioni
interface TransactionSummary {
    date: string;
    gevTransactions?: number;
    ldtTransactions?: number;
    lorTransactions?: number;
}

interface ChartDataItem {
    date: string;
    [key: string]: string | number; // 🔹 Permette altre chiavi dinamiche
}

const HomePage = () => {
    const [gevTransactionsNumber, setGevTransactionsNumber] = useState<TransactionSummary[]>([]);
    const [ldtTransactionsNumber, setLdtTransactionsNumber] = useState<TransactionSummary[]>([]);
    const [lorTransactionsNumber, setLorTransactionsNumber] = useState<TransactionSummary[]>([]);
    const [transactionsNumber, setTransactionsNumber] = useState<ChartDataItem[]>([]);
    const [sacsServiceOperations, setSacsServiceOperations] = useState<SacsServiceOperation[]>()

    const sacsData =  [
        {
            "CAUSAL": "20",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "21",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "22",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "23",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "24",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "25",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "26",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "27",
            "N_OPERATIONS": 10
        },
        {
            "CAUSAL": "28",
            "N_OPERATIONS": 10
        }
    ];

    useEffect(() => {
        gevTransactionSummary().then((response: TransactionSummary[]) => {
            setGevTransactionsNumber(response || []);
        });
        ldtTransactionSummary().then((response: TransactionSummary[]) => {
            setLdtTransactionsNumber(response || []);
        });
        lorTransactionSummary().then((response: TransactionSummary[]) => {
            setLorTransactionsNumber(response || []);
        });
        setSacsServiceOperations(sacsData)
    }, []);

    useEffect(() => {
        // Oggetto per aggregare i dati per ogni data
        const mergedTransactions: Record<string, ChartDataItem> = {};

        // Aggiungi i dati di `gevTransactionNumber`
        gevTransactionsNumber.forEach(({ date, gevTransactions = 0 }: TransactionSummary) => {
            if (!mergedTransactions[date]) {
                mergedTransactions[date] = { date, gev: 0, ldt: 0, lor: 0 };
            }
            mergedTransactions[date].gev = gevTransactions; // 🔹 Cambiato `gevTransaction` in `gev`
        });

        // Aggiungi i dati di `ldtTransactionNumber`
        ldtTransactionsNumber.forEach(({ date, ldtTransactions = 0 }: TransactionSummary) => {
            if (!mergedTransactions[date]) {
                mergedTransactions[date] = { date, gev: 0, ldt: 0, lor: 0 };
            }
            mergedTransactions[date].ldt = ldtTransactions; // 🔹 Cambiato `ldtTransaction` in `ldt`
        });

        // Aggiungi i dati di `lorTransactionNumber`
        lorTransactionsNumber.forEach(({ date, lorTransactions = 0 }: TransactionSummary) => {
            if (!mergedTransactions[date]) {
                mergedTransactions[date] = { date, gev: 0, ldt: 0, lor: 0 };
            }
            mergedTransactions[date].lor = lorTransactions; // 🔹 Cambiato `ldtTransaction` in `ldt`
        });

        // Converti l'oggetto aggregato in un array
        setTransactionsNumber(Object.values(mergedTransactions));
    }, [gevTransactionsNumber, ldtTransactionsNumber, lorTransactionsNumber]);


    console.log("test gevTransactionNumber", gevTransactionsNumber);

    const data = [
        { title: "Giocate", value: "431.500" },
        { title: "Depositi", value: "1234" },
        { title: "Registrazioni oggi", value: "1.355" },
        { title: "Accessi", value: "540" },
    ];

    const chartConfig2: Record<string, { label: string; color: string }> = {
        gev: { label: "Gev", color: "hsl(var(--chart-1))" },
        ldt: { label: "Ldt", color: "hsl(var(--chart-2))" },
        lor: { label: "Lotto", color: "hsl(var(--chart-3))" },
        virtual: { label: "Virtual", color: "hsl(var(--chart-4))" },
    };

    return (
            <div>
                HOMEPAGE
            <CardsContainer items={data}/>
            <div className="flex gap-4 my-8 w-full h-full justify-center">
                <div className="">
                    {transactionsNumber.length > 0 && <TestChart data={transactionsNumber} config={chartConfig2} className={"h-full"}/>}
                </div>
                <Card className="w-1/3">
                    <CardHeader className="font-bold">Ultime Operazioni di Servizio</CardHeader>
                    <CardContent>
                        {sacsServiceOperations && <GenericTable data={sacsServiceOperations} columns={sacsServiceOperationsColumns}/>}
                    </CardContent>
                </Card>
            </div>
            </div>
    );
};

export default HomePage;
