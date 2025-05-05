import {useEffect, useState} from "react";
import {DatePicker} from "@/components/DatePicker.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {sacsMovementsSummaryColumns} from "@/components/GenericTableColumn.tsx";
import {SacsMovementSummary} from "@/interfaces.ts";
import {sacsMovementsSummary} from "@/services/sacs_services.ts";
import {GenericPieChart} from "@/components/GenericPieChart.tsx";
import {ChartConfig} from "@/components/ui/chart.tsx";

const movementConfig = {
    1: {label: "Ricarica", color: "hsl(var(--chart-1))"},
    2: {label: "Storno Ricarica", color: "hsl(var(--chart-2))"},
    3: {label: "Prelievo", color: "hsl(var(--chart-3))"},
    4: {label: "Storno Prelievo", color: "hsl(var(--chart-4))"},
    5: {label: "Bonus", color: "hsl(var(--chart-5))"},
    6: {label: "Storno bonus", color: "hsl(var(--chart-6))"},
    7: {label: "Servizi Aggiuntivi", color: "hsl(var(--chart-7))"},
    8: {label: "Storno Costi Servizi Aggiuntivi", color: "hsl(var(--chart-8))"},
} satisfies ChartConfig;


const MovementsSummary = () => {
    // Stato: Date o null
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [movements, setMovements] = useState<SacsMovementSummary[]>([]);

    useEffect(() => {
        sacsMovementsSummary().then((response: {
            movements: SacsMovementSummary[];
        }) => {
            console.log("movements", response);
            setMovements(response.movements);
        })
            .catch((error: unknown) => {
                console.error("Error in riepilogo movimentazioni:", error);
            });
    }, [selectedDate]);

    return (
        <>
            <div className="w-full max-w-sm mx-auto">
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholder="Inserisci la data"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            {selectedDate && movements.length > 0 && (
                <div className="flex items-center w-full h-full justify-center gap-16 mt-16">
                    <GenericPieChart
                        data={movements}
                        nameKey="causal"
                        valueKey="operationNumber"
                        config={movementConfig}
                        title="Numero Operazioni per Riepilogo Movimenti"
                        description="Riepilogo movimenti per causale"
                        footerText="Totale operazioni"
                    />

                    <div className="w-full max-w-sm mt-8">
                        <span className="font-bold">Movimenti:</span>
                        <GenericTable data={movements} columns={sacsMovementsSummaryColumns}/>
                    </div>
                </div>
            )}
        </>

    );
};

export default MovementsSummary;
