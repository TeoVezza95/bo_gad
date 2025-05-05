import * as React from "react";
import {Label, Pie, PieChart} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card.tsx";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import {TrendingUp} from "lucide-react";

interface GenericPieChartProps<T extends object> {
    data: T[];
    /** nome della proprietà da usare come chiave di legenda (es: 'browser' o 'causal') */
    nameKey: keyof T;
    /** nome della proprietà numerica da sommare (es: 'visitors' o 'operationNumber') */
    valueKey: keyof T;
    /** config: per ogni stringa chiave, label e color */
    config: ChartConfig;
    title: string;
    description?: string;
    footerText?: React.ReactNode;
}

export function GenericPieChart<T extends object>({
                                                      data,
                                                      nameKey,
                                                      valueKey,
                                                      config,
                                                      title,
                                                      description,
                                                      footerText,
                                                  }: GenericPieChartProps<T>) {
// Costruisco l'array recharts-ready
    const chartData = React.useMemo(() => {
        return data.map((item) => {
            // estraggo il valore "chiave" e lo converto in stringa
            const key = String(item[nameKey]);
            // prendo eventualmente il colore dal config
            const cfg = config[key];
            return {
                name: key,
                value: Number(item[valueKey]),
                fill: cfg?.color,     // oppure un fallback se vuoi
            };
        });
    }, [data, nameKey, valueKey, config]);


    // Totale
    const total = React.useMemo(
        () => chartData.reduce((sum, seg) => sum + seg.value, 0),
        [chartData]
    );

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel/>}/>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({viewBox}) =>
                                    viewBox && "cx" in viewBox && "cy" in viewBox ? (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {total.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                {config[valueKey as string]?.label || "Totale"}
                                            </tspan>
                                        </text>
                                    ) : null
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {footerText && (
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                        {footerText} <TrendingUp className="h-4 w-4"/>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
