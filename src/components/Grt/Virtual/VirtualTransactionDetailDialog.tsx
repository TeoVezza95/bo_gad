import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {VirtualTransactionDetail} from "@/interfaces.ts";
import {virtualDetailTransaction} from "@/services/virtual_services.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {GenericTable} from "@/components/GenericTable.tsx";
import {
    virtualBetColumns,
    virtualSystemColumns, virtualTransactionsDetailColumns,
} from "@/components/GenericTableColumn.tsx";

interface VirtualTransactionDetailProps {
    transactionId: string;
}

const VirtualTransactionDetailDialog: React.FC<VirtualTransactionDetailProps> = ({
                                                                                     transactionId,
                                                                                 }) => {
    // Stato per tenere traccia dell'apertura del dialog
    const [open, setOpen] = useState(false);
    // Stato per i dati della transazione
    const [transactionDetail, setTransactionDetail] = useState<VirtualTransactionDetail>();
    // Stato per il loading
    const [loading, setLoading] = useState(false);
    // Stato per errori
    const [error, setError] = useState<string | null>(null);

    // Effettua la chiamata API quando il dialog viene aperto
    useEffect(() => {
        if (open) {
            setLoading(true);
            setError(null);
            virtualDetailTransaction(transactionId)
                .then((response) => {
                    console.log(response);
                    setTransactionDetail(response);
                })
                .catch((err) => {
                    console.error("Errore API:", err);
                    setError("Errore nel recupero dei dettagli della transazione.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, transactionId]);

    const renderTicketDetailsTable = (detail: VirtualTransactionDetail) => (
        <dl className="w-full text-sm">
            <div className="py-1">
                <dt className="font-bold">ID:</dt>
                <dd>{detail.id}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Ticket ID:</dt>
                <dd>{detail.ticketId}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Importo:</dt>
                <dd>{detail.wagerAmount}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Importo Vincita:</dt>
                <dd>{detail.winAmount}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Importo Rimborsato:</dt>
                <dd>{detail.refundAmount}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Stato:</dt>
                <dd>{detail.ticketStatus}</dd>
            </div>
        </dl>
    );

    const renderTransactionDetails = () => {
        if (!transactionDetail) return null;

        return (
            <div className="flex gap-4 pb-6">

                <div className="w-1/4">
                    <Card className="shadow-md h-full">
                        <CardHeader>
                            <CardTitle>Dettagli Transazione</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderTicketDetailsTable(transactionDetail)}
                        </CardContent>
                    </Card>
                </div>


                <div className="w-3/4">
                    {/* Griglia interna: 2 colonne, ma la card "Bets" potrà occupare entrambe */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Systems */}
                        {transactionDetail.systems && transactionDetail.systems.length > 0 && (
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Sistemi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GenericTable
                                        data={transactionDetail.systems}
                                        columns={virtualSystemColumns}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {transactionDetail.bets && transactionDetail.bets.length > 0 && (
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Scommesse</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GenericTable
                                        data={transactionDetail.bets}
                                        columns={virtualBetColumns}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Transactions */}
                        {transactionDetail.transactions && transactionDetail.transactions.length > 0 && (
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Transazioni</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GenericTable
                                        data={transactionDetail.transactions}
                                        columns={virtualTransactionsDetailColumns}
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
            <DialogTrigger asChild>
                <Button variant="outline">Dettaglio</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[99vw]">
                <DialogHeader>
                    <DialogTitle>Dettaglio Transazione Virtuale</DialogTitle>
                    <DialogDescription>
                        Qui vengono mostrati i dettagli della transazione.
                    </DialogDescription>
                </DialogHeader>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && transactionDetail && renderTransactionDetails()}
                {/*<DialogFooter>*/}
                {/*    <Button onClick={() => setOpen(false)}>Chiudi</Button>*/}
                {/*</DialogFooter>*/}
            </DialogContent>
        </Dialog>
    );
};

export default VirtualTransactionDetailDialog;
