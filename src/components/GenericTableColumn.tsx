import {
    ActBonus,
    ActStorni,
    EwlTransaction,
    GevRegistryKey,
    GevTransaction,
    LdtContest,
    LdtRegistryKey,
    LdtTransaction,
    LorContest,
    LorRegistryKey,
    LorTransaction,
    LorWinningBetsTransaction,
    LorWinningDetail,
    LorWinningList,
    OnpTransaction, SacsDormantAccount, SacsMovementSummary, SacsSelfExcludedAccount,
    SacsServiceOperation, SacsWithoutSubregistrationAccount,
    TableColumn,
    VirtualBet,
    VirtualSystem,
    VirtualTransaction,
    VirtualTransactionsDetail
} from "@/interfaces.ts";
import {Badge} from "@/components/ui/badge.tsx";


export const statusMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="warning">Prenotata</Badge>,
    "2": <Badge variant="success">Completata</Badge>,
    "3": <Badge variant="destructive">Annullata</Badge>,
};

export const virtualStatusMapping: { [key: string]: JSX.Element } = {
    "0": <Badge variant="default">Pending</Badge>,
    "3": <Badge variant="success">Pagato</Badge>,
    "4": <Badge variant="orange">Rimborsato</Badge>,
    "5": <Badge variant="water">Pagato/Rimborsato</Badge>,
    "50": <Badge variant="destructive">Perdente</Badge>,
};

export const channelMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="secondary">WEB</Badge>,
    "2": <Badge variant="gadBlue">MOB</Badge>,
}

export const statusContestMapping: { [key: string]: JSX.Element } = {
    "A": <Badge variant="success">Aperto</Badge>,
    "C": <Badge variant="destructive">Chiuso</Badge>,
    "S": <Badge variant="warning">Sospeso</Badge>,
}

export const typeMapping: { [key: string]: JSX.Element } = {
    "10ELOTTO IMMEDIATA": <div><Badge variant="gadBlue">10ELOTTO</Badge><Badge
        variant="secondaryGadBlue">IMMEDIATA</Badge></div>,
    "10ELOTTO FREQUENTE": <div><Badge variant="gadBlue">10ELOTTO</Badge><Badge
        variant="secondaryOrange">FREQUENTE</Badge></div>,
    "10ELOTTO LOTTO": <div><Badge variant="gadBlue">10ELOTTO</Badge><Badge variant="orange">LOTTO</Badge></div>,
    "LOTTO": <Badge variant="orange">LOTTO</Badge>,
    "MILLIONDAY": <Badge variant="water">MILLIONDAY</Badge>,
}

export const lorWinningTypeMapping: { [key: string]: JSX.Element } = {
    "0": <Badge variant="gadBlue">Bassa</Badge>,
    "1": <Badge variant="success">Alta</Badge>,
}

export const notificationMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="success">Notificata</Badge>,
    "0": <Badge variant="warning">Da Notificare</Badge>,
    "-1": <Badge variant="destructive">Errore</Badge>,
};

export const processedMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="success">Processato</Badge>,
    "0": <Badge variant="warning">Da Processare</Badge>,
    "-1": <Badge variant="destructive">Errore</Badge>,
};

export const bonusOperationMapping: { [key: string]: JSX.Element } = {
    "9": <Badge variant="success">Creation Bonus Bag</Badge>,
    "19": <Badge variant="destructive">Removal</Badge>,
    "20": <Badge variant="warning">Expiration</Badge>,
}

export const onpTypeMapping: { [key: string]: JSX.Element } = {
    "2": <Badge variant="secondary">Ricarica</Badge>,
    "3": <Badge variant="gadBlue">Prelievo</Badge>,
}

export const sacsServiceOperationsMapping: { [key: string]: JSX.Element } = {
    "20": <b>Apertura Conto Persona Fisica</b>,
    "21": <b>Apertura Conto Persona Giuridica</b>,
    "22": <b>Cambio Stato Conto</b>,
    "23": <b>Saldo Conto</b>,
    "24": <b>Modifica Provincia Residenza</b>,
    "25": <b>Interrogazione Stato Conto</b>,
    "26": <b>Subregistrazione</b>,
    "27": <b>Modifica Dati Documento Titolare Conto</b>,
    "28": <b>Migrazione Conto Di Gioco</b>,
    "33": <b>Apertura Semplificata Conto Persona Fisica</b>,
    "34": <b>Integrazione Apertura Semplificata Conto Persona Fisica</b>,
    "35": <b>Conto Dormiente</b>,
    "36": <b>Interrogazione Estremi Documento</b>,
    "37": <b>Gestione Autoesclusione Trasversale</b>,
    "38": <b>Aggiorna Limiti Conto</b>,
    "39": <b>Aggiorna Pseudonimo Conto</b>,
    "40": <b>Aggiorna Posta Elettronica Conto</b>,
};


export const sacsMovementsSummaryMapping: { [key: string]: JSX.Element } = {
    "1": <b>Ricarica</b>,
    "2": <b>Storno Ricarica</b>,
    "3": <b>Prelievo</b>,
    "4": <b>Storno Prelievo</b>,
    "5": <b>Bonus</b>,
    "6": <b>Storno Bonus</b>,
    "7": <b>Costi Servizi Aggiuntivi</b>,
    "8": <b>Storno Costi Servizi Aggiuntivi</b>,
};

//GEV
export const gevTransactionColumns: TableColumn<GevTransaction>[] = [
    {header: "Transazione", accessor: "id"},
    {header: "Conto Gioco", accessor: "contractid"},
    {header: "Data Inizio", accessor: "startDate"},
    {header: "Data Fine", accessor: "endDate"},
    {
        header: "Stato",
        accessor: "status",
        render: (value) => statusMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>
    },
    {header: "Importo", accessor: "amount", render: (value) => <Badge variant={"gadBlue"}>€ {value}</Badge>},
];

export const gevRegistryKeyColumns: TableColumn<GevRegistryKey>[] = [
    {header: "Conto Gioco", accessor: "contractId"},
    {header: "Dati Criptati", accessor: "cryptedData"},
    {header: "IP Registrazione", accessor: "clientIp"},
    {header: "Data Registrazione", accessor: "registrationDate"},
];

//LDT
export const ldtTransactionColumns: TableColumn<LdtTransaction>[] = [
    {header: "Transazione", accessor: "id"},
    {header: "Conto Gioco", accessor: "contractid"},
    {header: "Data Inizio", accessor: "startDate"},
    {header: "Data Fine", accessor: "endDate"},
    {
        header: "Stato",
        accessor: "status",
        render: (value) => statusMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,
    },
    {header: "Importo", accessor: "amount", render: (value) => <Badge variant={"gadBlue"}>€ {value}</Badge>},
];

export const ldtRegistryKeyColumns: TableColumn<LdtRegistryKey>[] = [
    {header: "Conto Gioco", accessor: "contractId"},
    {header: "Dati Criptati", accessor: "cryptedData"},
    {header: "IP Registrazione", accessor: "clientIp"},
    {header: "Data Registrazione", accessor: "registrationDate"},
];

export const ldtContestColumns: TableColumn<LdtContest>[] = [
    {header: "ID", accessor: "gameId"},
    {header: "Lotteria", accessor: "lotteryId"},
    {
        header: "Canale",
        accessor: "gameChannel",
        render: (value) => channelMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,
    },
    {header: "Nome", accessor: "gameName"},
    {
        header: "Stato",
        accessor: "status",
        render: (value) => statusContestMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,
    },
    {header: "Data Censimento", accessor: "insertDate"},
    {header: "Data Aggiornamento", accessor: "updateDate"},
];

//LOR
export const lorTransactionColumns: TableColumn<LorTransaction>[] = [
    {
        header: "Tipologia",
        accessor: "contestType",
        render: (value) => typeMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,
    },
    {header: "Transazione", accessor: "id"},
    {header: "Conto Gioco", accessor: "contractid"},
    {header: "Data", accessor: "wagerDate"},
    {header: "Concorso", accessor: "contestCode"},
    {header: "Importo", accessor: "amount", render: (value) => <Badge variant={"gadBlue"}>€ {value}</Badge>},
];
export const lorRegistryKeyColumns: TableColumn<LorRegistryKey>[] = [
    {header: "Conto Gioco", accessor: "contractId"},
    {header: "Dati Criptati", accessor: "cryptedData"},
    {header: "IP Registrazione", accessor: "clientIp"},
    {header: "Data Registrazione", accessor: "registrationDate"},
];
export const lorContestColumns: TableColumn<LorContest>[] = [
    {
        header: "Tipologia",
        accessor: "contestType",
        render: (value) => typeMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,
    },
    {header: "Concorso", accessor: "contestCode"},
    {header: "Data Chiusura", accessor: "closureDate"},
    {header: "Lista Vincenti", accessor: "winningBets"},
    {
        header: "Processato",
        accessor: "processed",
        render: (value) => processedMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,
    },
];
export const LorWinningListColumns: TableColumn<LorWinningList>[] = [
    {
        header: "Tipologia",
        accessor: "contestType",
        render: (value) => typeMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,
    },
    {header: "Concorso", accessor: "contestCode"},
    // {header: "ID", accessor: "id"},
    {header: "Data Comunicazione", accessor: "communicationDate"},
    {
        header: "Processato",
        accessor: "processed",
        render: (value) => processedMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,
    },
    {
        header: "Notificata",
        accessor: "notified",
        render: (value) => notificationMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,
    },
];


//LOR WINNING DETAIL
export const LorWinningDetailColumns: TableColumn<LorWinningDetail>[] = [
    {header: "ID", accessor: "id"},
    {header: "Concorso", accessor: "contestCode"},
    {header: "Data Inserimento", accessor: "insertDate"},
    {
        header: "Tipologia",
        accessor: "contestType",
    },
]

export const LorWinningBetsTransactionColumns: TableColumn<LorWinningBetsTransaction>[] = [
    {header: "Schedina", accessor: "transactionId"},
    {header: "Scontrino", accessor: "betId"},
    {header: "Importo Lordo", accessor: "grossImport"},
    {header: "Importo Netto", accessor: "netImport"},
    {header: "Importo Accredito", accessor: "creditImport"},
    {
        header: "Fascia Vincita",
        accessor: "winningType",
        render: (value) => lorWinningTypeMapping[String(value)] || <Badge variant={"default"}>{value || ""}</Badge>,
    },
]

//VIRTUAL
export const virtualTransactionColumns: TableColumn<VirtualTransaction>[] = [
    {header: "Transazione", accessor: "id"},
    {header: "Conto Gioco", accessor: "contractId"},
    {header: "Ticket ID", accessor: "ticketId"},
    {header: "Data Transazione", accessor: "transactionDate"},
    {
        header: "Stato",
        accessor: "status",
        render: (value) => virtualStatusMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>
    },
    {header: "Importo", accessor: "amount", render: (value) => <Badge variant={"gadBlue"}>€ {value}</Badge>},
];

export const virtualTransactionsDetailColumns: TableColumn<VirtualTransactionsDetail>[] = [
    {header: "ID", accessor: "id"},
    {header: "Tipologia", accessor: "type"},
    {header: "Data", accessor: "date"},
    {header: "Transazione CMD", accessor: "cmdTransaction"},
];

export const virtualSystemColumns: TableColumn<VirtualSystem>[] = [
    {header: "#", accessor: "systemId"},
    {header: "Ticket", accessor: "ticketId"},
    {header: "Tipo", accessor: "systemType"},
    {header: "Combinazioni", accessor: "combinations"},
    {header: "Base", accessor: "base"},
    {header: "Vincita Min", accessor: "minWin"},
    {header: "Vincita Max", accessor: "maxWin"},
    {header: "Bonus Min", accessor: "minBonusWin"},
    {header: "Bonus Max", accessor: "maxBonusWin"},
];

export const virtualBetColumns: TableColumn<VirtualBet>[] = [
    {header: "#", accessor: "betid"},
    {header: "Scommessa", accessor: "bet"},
    {header: "Evento", accessor: "event"},
    {header: "Data Evento", accessor: "eventDate"},
    {header: "Descrizione", accessor: "eventDescription"},
    {header: "Risultato", accessor: "results"},
    {header: "Desc. Risultato", accessor: "resultsDescription"},
    {header: "Importo", accessor: "wagerAmount"},
];

//ACT
export const actBonusColumns: TableColumn<ActBonus>[] = [
    {header: "ID", accessor: "ID"},
    {header: "Importo", accessor: "USER_CURRENCY_AMOUNT"},
    {header: "Data Censimento", accessor: "INSERTION_DATE"},
    {header: "Data transazione", accessor: "TRANSACTION_DATE"},
    {
        header: "Operazione",
        accessor: "OPERATION_ID",
        render: (value) => bonusOperationMapping[String(value)] || <Badge variant={"default"}>{value || "null"}</Badge>,
    },
    {header: "Calling client ID", accessor: "CALLING_CLIENT_ID"},
];

export const actStorniColumns: TableColumn<ActStorni>[] = [
    {header: "ID", accessor: "ID"},
    {header: "Importo", accessor: "USER_CURRENCY_AMOUNT"},
    {header: "Data Censimento", accessor: "INSERTION_DATE"},
    {header: "Data transazione", accessor: "TRANSACTION_DATE"},
    {header: "Operazione", accessor: "OPERATION_ID"},
    {header: "Calling client ID", accessor: "CALLING_CLIENT_ID"},
];

export const onpColumns: TableColumn<OnpTransaction>[] = [
    {header: "ID", accessor: "ID"},
    {
        header: "ID Tipo",
        accessor: "TXT_TYPE_ID",
        render: (value) => onpTypeMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,
    },
    {header: "ID Istruzione", accessor: "INSTRUCTION_ID"},
    {header: "Conto Gioco", accessor: "CONTRACT_ID"},
    {header: "Operazione", accessor: "OPERATION_ID"},
    {header: "Data", accessor: "TRANSACTION_DATE"},
    {header: "EWL ID", accessor: "EWALLET_TRANSACTION_ID"},
    {header: "EWL REF ID", accessor: "EWALLET_TRANSACTION_REF_ID"},
    {header: "Transazione", accessor: "TRANSACTION_ID"},
    {header: "Importo", accessor: "AMOUNT"},
];

export const ewlColumns: TableColumn<EwlTransaction>[] = [
    {header: "ID Trans Ext", accessor: "TXT_TRANS_EXT_ID"},
    {header: "Operazione", accessor: "OPERATION_ID"},
    {header: "Data", accessor: "DATE_TRANSACTION"},
    {header: "Transazione", accessor: "TRANSACTION_ID"},
    {header: "Importo Utente", accessor: "AMOUNT_USER_EXCHANGE"},
    {header: "Ref ID Associato", accessor: "ASSOCIATED_TRANSACTION_REF_ID"},
    {header: "Metodo Pagamento", accessor: "PSP_METHOD"},
];

export const aperGiurFormColumns: TableColumn<ActStorni>[] = [
    {header: "ID", accessor: "ID"},
    {header: "ID Tipo", accessor: "ID"},
];

export const sacsServiceOperationsColumns: TableColumn<SacsServiceOperation>[] = [
    {
        header: "Causale",
        accessor: "causal",
        render: (value) => sacsServiceOperationsMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,
    },
    {header: "Numero Operazioni", accessor: "numeroOperazioni"},
];

export const sacsMovementsSummaryColumns: TableColumn<SacsMovementSummary>[] = [
    {
        header: "Causale",
        accessor: "causal",
        render: (value) => sacsMovementsSummaryMapping[String(value)] ||
            <Badge variant={"default"}>{value}</Badge>,
    },
    {header: "Numero Operazioni", accessor: "operationNumber"},
    {header: "Importo", accessor: "amount"}
]

export const sacsSelfExcludedAccountsColumns: TableColumn<SacsSelfExcludedAccount>[] = [
    {header: "Conto Gioco", accessor: "contractId"},
    {header: "Tipologia", accessor: "selfExclusionType"},
    {header: "Data Inizio", accessor: "startDate"},
    {header: "Data Fine", accessor: "endDate"},
    {header: "Data Inserimento", accessor: "insertDate"},
];

export const sacsDormantAccountsColumns: TableColumn<SacsDormantAccount>[] = [
    {header: "Conto Gioco", accessor: "contractId"},
    {header: "Importo", accessor: "amount"},
    {header: "Data Inserimento", accessor: "insertDate"},
];

export const sacsWithoutSubregistrationAccountsColumns: TableColumn<SacsWithoutSubregistrationAccount>[] = [
    {header: "Conto Gioco", accessor: "codiceConto"},
    {header: "ID ContoCN", accessor: "idCnConto"},
    {header: "ID Rete", accessor: "idReteConto"},
];



