import {GenericFilters} from "@/components/GenericFilters.tsx";
import {z} from "zod";
import {GenericTable} from "@/components/GenericTable.tsx";
import {virtualTransactionColumns, virtualStatusMapping} from "@/components/GenericTableColumn.tsx";
import {VirtualTransaction, FilterField} from "@/interfaces.ts";
import {useEffect, useState} from "react";
import {virtualTransactions} from "@/services/virtual_services.ts";
import PaginationControls from "@/components/PaginatorControls.tsx";
import VirtualTransactionDetailDialog from "@/components/Grt/Virtual/VirtualTransactionDetailDialog.tsx";

// Schema per le transazioni
const virtualTransactionFilterSchema = z.object({
    id: z.string().optional(),
    contractId: z.string().optional(),
    ticketId: z.string().optional(),
    DATE_RANGE: z
        .object({
            from: z.date().optional(),
            to: z.date().optional(),
        })
        .optional(),
    status: z.string().optional(),
});

// Definizione dei campi filtro per le transazioni
const virtualTransactionFilterFields: FilterField<z.infer<typeof virtualTransactionFilterSchema>>[] = [
    {field: "id", label: "Transazione", type: "text"},
    {field: "contractId", label: "Conto Gioco", type: "text"},
    {field: "ticketId", label: "Ticket Id", type: "text"},
    {field: "DATE_RANGE", label: "Data", type: "daterange"},
    {
        field: "status",
        label: "Stato",
        type: "select",
        options: [
            {label: "Pending", value: "0"},
            {label: "Pagato", value: "3"},
            {label: "Rimborsato", value: "4"},
            {label: "Pagato/Rimborsato", value: "5"},
            {label: "Perdente", value: "50"},
        ],
    },
];

const VirtualTransactions = () => {
    const [virtualTransaction, setVirtualTransaction] = useState<VirtualTransaction[]>([]);
    const [virtualTransactionFilters, setVirtualTransactionFilters] = useState<z.infer<typeof virtualTransactionFilterSchema>>({});
    const [totalRecords, setTotalRecords] = useState(1);
    const pageOptions = [10, 20, 30, 40, 50];

    useEffect(() => {
        handlePaginationChange(1, 10)
    }, [virtualTransactionFilters])

    // Questa funzione verrà invocata dal componente di paginazione
    const handlePaginationChange = (currentPage: number, pageSize: number) => {
        virtualTransactions(virtualTransactionFilters, currentPage, pageSize)
            .then((response: {
                transactions: VirtualTransaction[];
                pagination: { page: number; pageSize: number; total: number }
            }) => {
                setVirtualTransaction(response.transactions);
                setTotalRecords(response.pagination.total);
            })
            .catch((error: unknown) => {
                console.error("Error in virtualTransactions:", error);
            });
    };

    // Funzione per applicare i filtri, che eventualmente resetta la paginazione (qui puoi anche resettare gli stati di PaginationControls se necessario)
    const handleFilter = (
        filters: Record<string, unknown>
    ) => {
        console.log("Filtering data virtualTransactions:", filters);
        setVirtualTransactionFilters(filters as z.infer<typeof virtualTransactionFilterSchema>);
    };

    return (
        <>
            <GenericFilters<z.infer<typeof virtualTransactionFilterSchema>>
                schema={virtualTransactionFilterSchema}
                filters={virtualTransactionFilters}
                mapping={virtualStatusMapping}
                filterFields={virtualTransactionFilterFields}
                onFilter={(values) => handleFilter(values)}
            />
            <GenericTable data={virtualTransaction} columns={virtualTransactionColumns}
                          actions={(row) => (
                              <div className="flex gap-2">
                                  <VirtualTransactionDetailDialog transactionId={row.id}/> {/* Puoi aggiungere altri bottoni se necessario */}
                              </div>
                          )}
            />
            <PaginationControls
                pageOptions={pageOptions}
                totalRecords={totalRecords}
                onPaginationChange={handlePaginationChange}
            />
        </>
    )
}
export default VirtualTransactions;