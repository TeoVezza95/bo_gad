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
import {LorWinningDetail} from "@/interfaces.ts";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {GenericTable} from "@/components/GenericTable.tsx";
import {lorWinningDetail} from "@/services/lor_services.ts";
import {LorWinningBetsTransactionColumns, typeMapping} from "@/components/GenericTableColumn.tsx";

interface LorWinningDetailProps {
    id: number;
}

const LorWinningDetailDialog: React.FC<LorWinningDetailProps> = ({
                                                                     id,
                                                                 }) => {
    // Stato per tenere traccia dell'apertura del dialog
    const [open, setOpen] = useState(false);
    // Stato per i dati della transazione
    const [winningDetail, setWinningDetail] = useState<LorWinningDetail>();
    // Stato per il loading
    const [loading, setLoading] = useState(false);
    // Stato per errori
    const [error, setError] = useState<string | null>(null);

    // Effettua la chiamata API quando il dialog viene aperto
    useEffect(() => {
        if (open) {
            setLoading(true);
            setError(null);
            lorWinningDetail(id)
                .then((response) => {
                    console.log(response);
                    setWinningDetail(response);
                })
                .catch((err) => {
                    console.error("Errore API:", err);
                    setError("Errore nel recupero dei dettagli della transazione.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, id]);

    const renderLorWinningDetailsTable = (detail: LorWinningDetail) => (
        <dl className="w-full text-sm">
            <div className="py-1">
                <dt className="font-bold">ID:</dt>
                <dd>{detail.id}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Tipologia:</dt>
                <dd>{typeMapping[detail.contestType] || detail.contestType}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Concorso:</dt>
                <dd>{detail.contestCode}</dd>
            </div>
            <div className="py-1">
                <dt className="font-bold">Data Inserimento:</dt>
                <dd>{detail.insertDate}</dd>
            </div>
        </dl>
    );

    const renderTransactionDetails = () => {
        if (!winningDetail) return null;

        return (
            <div className="flex gap-4 pb-6">

                <div className="w-1/4">
                    <Card className="shadow-md h-full">
                        <CardHeader>
                            <CardTitle>Dettagli Vincita</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderLorWinningDetailsTable(winningDetail)}
                        </CardContent>
                    </Card>
                </div>


                <div className="w-3/4">
                    {/* Griglia interna: 2 colonne, ma la card "Bets" potrà occupare entrambe */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Bets (col-span-2 => occupa l'intera riga) */}
                        {winningDetail.winningBets && winningDetail.winningBets.length > 0 && (
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Accrediti</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GenericTable
                                        data={winningDetail.winningBets}
                                        columns={LorWinningBetsTransactionColumns}
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
                    <DialogTitle>Dettaglio Giocata Vincente</DialogTitle>
                    <DialogDescription>
                        Qui vengono mostrati i dettagli della giocata vincente.
                    </DialogDescription>
                </DialogHeader>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && winningDetail && renderTransactionDetails()}
                {/*<DialogFooter>*/}
                {/*    <Button onClick={() => setOpen(false)}>Chiudi</Button>*/}
                {/*</DialogFooter>*/}
            </DialogContent>
        </Dialog>
    );
};

export default LorWinningDetailDialog;
