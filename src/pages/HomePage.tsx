import { useEffect, useState } from "react";
import { Chart } from "@/components/Chart.tsx";
import { CardsContainer } from "@/components/CardsContainer.tsx";
import { TestChart } from "@/components/Grt/TestChart.tsx";
import { gevTransactionSummary } from "@/services/gev_services.ts";
import {ldtTransactionSummary} from "@/services/ldt_services.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {actBonusColumns, sacsServiceOperationsColumns} from "@/components/GenericTableColumn.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {ActBonus, SacsServiceOperation} from "@/interfaces.ts";

// Definizione del tipo per gli elementi delle transazioni
interface TransactionSummary {
    date: string;
    gevTransactions?: number;
    ldtTransactions?: number;
}

interface ChartDataItem {
    date: string;
    [key: string]: string | number; // 🔹 Permette altre chiavi dinamiche
}

const HomePage = () => {
    const [gevTransactionsNumber, setGevTransactionsNumber] = useState<TransactionSummary[]>([]);
    const [ldtTransactionsNumber, setLdtTransactionsNumber] = useState<TransactionSummary[]>([]);
    const [transactionsNumber, setTransactionsNumber] = useState<ChartDataItem[]>([]);
    const [sacsServiceOperations, setBonus] = useState<SacsServiceOperation[]>(
        [
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
        ]
    )

    useEffect(() => {
        gevTransactionSummary().then((response: TransactionSummary[]) => {
            setGevTransactionsNumber(response || []);
        });
        ldtTransactionSummary().then((response: TransactionSummary[]) => {
            setLdtTransactionsNumber(response || []);
        });
    }, []);

    useEffect(() => {
        // Oggetto per aggregare i dati per ogni data
        const mergedTransactions: Record<string, ChartDataItem> = {};

        // Aggiungi i dati di `gevTransactionNumber`
        gevTransactionsNumber.forEach(({ date, gevTransactions = 0 }: TransactionSummary) => {
            if (!mergedTransactions[date]) {
                mergedTransactions[date] = { date, gev: 0, ldt: 0 };
            }
            mergedTransactions[date].gev = gevTransactions; // 🔹 Cambiato `gevTransaction` in `gev`
        });

        // Aggiungi i dati di `ldtTransactionNumber`
        ldtTransactionsNumber.forEach(({ date, ldtTransactions = 0 }: TransactionSummary) => {
            if (!mergedTransactions[date]) {
                mergedTransactions[date] = { date, gev: 0, ldt: 0 };
            }
            mergedTransactions[date].ldt = ldtTransactions; // 🔹 Cambiato `ldtTransaction` in `ldt`
        });

        // Converti l'oggetto aggregato in un array
        setTransactionsNumber(Object.values(mergedTransactions));
    }, [gevTransactionsNumber, ldtTransactionsNumber]);


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
        lotto: { label: "Lotto", color: "hsl(var(--chart-3))" },
        virtual: { label: "Virtual", color: "hsl(var(--chart-4))" },
    };

    return (
        <>

            <div className="size-full">HOMEPAGE</div>
            <CardsContainer items={data}/>
            <div className="flex gap-2">
                <div className="">
                    {transactionsNumber.length > 0 && <TestChart data={transactionsNumber} config={chartConfig2}/>}
                </div>
                <Card className="w-1/2">
                    <CardHeader className="font-bold">Ultime Operazioni di Servizio</CardHeader>
                    <CardContent>
                        <GenericTable data={sacsServiceOperations} columns={sacsServiceOperationsColumns}/>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default HomePage;
