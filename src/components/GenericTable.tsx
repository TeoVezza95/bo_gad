import React from "react";
import {
    Table,
    TableCaption,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { TableColumn } from "@/interfaces";
import { TruncatedCell } from "./TruncatedCell"; // Assicurati di usare il percorso corretto

// Estendiamo l'interfaccia dei props aggiungendo la prop actions.
// Qui actions è opzionale ed è una funzione che riceve il dato della riga e restituisce un JSX.
export interface GenericTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    caption?: string;
    actions?: (row: T) => React.ReactNode;
}

export const GenericTable = <T,>({
                                     data,
                                     columns,
                                     caption,
                                     actions,
                                 }: GenericTableProps<T>) => {
    return (
        <div className="w-full overflow-auto">
            <Table className="w-full table-fixed">
                {caption && <TableCaption>{caption}</TableCaption>}
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index}>{column.header}</TableHead>
                        ))}
                        {/* Aggiungiamo una colonna per le actions se la prop è definita */}
                        {actions && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((column, colIndex) => {
                                const cellContent = column.render
                                    ? column.render(row[column.accessor], row)
                                    : (row[column.accessor] as React.ReactNode);
                                return (
                                    <TableCell key={colIndex}>
                                        {typeof cellContent === "string" ? (
                                            <TruncatedCell text={cellContent} />
                                        ) : (
                                            cellContent
                                        )}
                                    </TableCell>
                                );
                            })}
                            {actions && (
                                <TableCell>
                                    {actions(row)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
