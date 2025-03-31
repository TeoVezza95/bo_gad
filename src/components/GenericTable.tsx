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

interface GenericTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    caption?: string;
}

export const GenericTable = <T,>({ data, columns, caption }: GenericTableProps<T>) => {
    return (
        <div className="w-full overflow-auto">
            <Table className="w-full table-fixed">
                {caption && <TableCaption>{caption}</TableCaption>}
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index}>{column.header}</TableHead>
                        ))}
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
