import {useEffect, useState} from "react";
import {DatePicker} from "@/components/DatePicker.tsx";
import {GenericTable} from "@/components/GenericTable.tsx";
import {sacsServiceOperationsColumns} from "@/components/GenericTableColumn.tsx";
import {SacsServiceOperation} from "@/interfaces.ts";
import {sacsServiceOperations} from "@/services/sacs_services.ts";
import {GenericPieChart} from "@/components/GenericPieChart.tsx";
import {ChartConfig} from "@/components/ui/chart.tsx";

const movementConfig = {
    20: {label: "Apertura Conto Persona Fisica", color: "hsl(var(--chart-1))"},
    21: {label: "Apertura Conto Persona Giuridica", color: "hsl(var(--chart-2))"},
    22: {label: "Cambio Stato Conto", color: "hsl(var(--chart-3))"},
    23: {label: "Saldo Conto", color: "hsl(var(--chart-4))"},
    24: {label: "Modifica Provincia Residenza", color: "hsl(var(--chart-5))"},
    25: {label: "Interrogazione Stato Conto", color: "hsl(var(--chart-6))"},
    26: {label: "Subregistrazione", color: "hsl(var(--chart-7))"},
    27: {label: "Modifica Dati Documento Titolare Conto", color: "hsl(var(--chart-8))"},
    28: {label: "Migrazione Conto Di Gioco", color: "hsl(var(--chart-9))"},
    33: {label: "Apertura Semplificata Conto Persona Fisica", color: "hsl(var(--chart-10))"},
    34: {label: "Integrazione Apertura Semplificata Conto Persona Fisica", color: "hsl(var(--chart-11))"},
    35: {label: "Conto Dormiente", color: "hsl(var(--chart-12))"},
    36: {label: "Interrogazione Estremi Documento", color: "hsl(var(--chart-13))"},
    37: {label: "Gestione Autoesclusione Trasversale", color: "hsl(var(--chart-14))"},
    38: {label: "Aggiorna Limiti Conto", color: "hsl(var(--chart-15))"},
    39: {label: "Aggiorna Pseudonimo Conto", color: "hsl(var(--chart-16))"},
    40: {label:"Aggiorna Posta Elettronica Conto", color: "hsl(var(--chart-17))"},
} satisfies ChartConfig;


const ServiceOperations = () => {
    // Stato: Date o null
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [serviceOperations, setServiceOperations] = useState<SacsServiceOperation[]>([]);

    useEffect(() => {
        sacsServiceOperations().then((response: {
            serviceOperations: SacsServiceOperation[];
        }) => {
            console.log("movements", response);
            setServiceOperations(response.serviceOperations);
        })
            .catch((error: unknown) => {
                console.error("Error in riepilogo operazioni servizio:", error);
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
            {selectedDate && serviceOperations.length > 0 && (
                <div className="flex items-center w-full h-full justify-center gap-16 mt-16">
                    <GenericPieChart
                        data={serviceOperations}
                        nameKey="causal"
                        valueKey="numeroOperazioni"
                        config={movementConfig}
                        title="Numero Operazioni per Riepilogo Movimenti"
                        description="Riepilogo movimenti per causale"
                        footerText="Totale operazioni"
                    />

                    <div className="w-full max-w-sm mt-8">
                        <span className="font-bold">Movimenti:</span>
                        <GenericTable data={serviceOperations} columns={sacsServiceOperationsColumns}/>
                    </div>
                </div>
            )}
        </>

    );
};

export default ServiceOperations;
