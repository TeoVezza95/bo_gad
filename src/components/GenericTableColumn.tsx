import {
    ActBonus, ActStorni, EwlTransaction,
    GevRegistryKey,
    GevTransaction,
    LdtContest,
    LdtRegistryKey,
    LdtTransaction, LorContest, LorRegistryKey,
    LorTransaction, LorWinning, OnpTransaction,
    TableColumn
} from "@/interfaces.ts";
import {Badge} from "@/components/ui/badge.tsx";


const statusMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="warning">Prenotata</Badge>,
    "2": <Badge variant="success">Completata</Badge>,
    "3": <Badge variant="destructive">Annullata</Badge>,
};

const channelMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="secondary">WEB</Badge>,
    "2": <Badge variant="gadBlue">MOB</Badge>,
}

const statusContestMapping: { [key: string]: JSX.Element } = {
    "A": <Badge variant="success">Aperto</Badge>,
    "C": <Badge variant="destructive">Chiuso</Badge>,
    "S": <Badge variant="warning">Sospeso</Badge>,
}

const typeMapping: { [key: string]: JSX.Element } = {
    "10ELOTTO IMMEDIATA": <div><Badge variant="gadBlue">10ELOTTO</Badge><Badge variant="secondaryGadBlue">IMMEDIATA</Badge></div>,
    "10ELOTTO FREQUENTE": <div><Badge variant="gadBlue">10ELOTTO</Badge><Badge variant="secondaryOrange">FREQUENTE</Badge></div>,
    "10ELOTTO LOTTO": <div><Badge variant="gadBlue">10ELOTTO</Badge><Badge variant="orange">LOTTO</Badge></div>,
    "LOTTO": <Badge variant="orange">LOTTO</Badge>,
    "MILLIONDAY": <Badge variant="water">MILLIONDAY</Badge>,
}

const notificationMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="success">Notificata</Badge>,
    "0": <Badge variant="warning">Da Notificare</Badge>,
    "-1": <Badge variant="destructive">Errore</Badge>,
};

const processedMapping: { [key: string]: JSX.Element } = {
    "1": <Badge variant="success">Processato</Badge>,
    "0": <Badge variant="warning">Da Processare</Badge>,
    "-1": <Badge variant="destructive">Errore</Badge>,
};

export const gevTransactionColumns: TableColumn<GevTransaction>[] = [
    {header: "Transazione", accessor: "id"},
    {header: "Conto Gioco", accessor: "contractid"},
    {header: "Data Inizio", accessor: "startDate"},
    {header: "Data Fine", accessor: "endDate"},
    {header: "Stato", accessor: "status", render: (value) => statusMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>},
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
    {header: "Stato", accessor: "status", render: (value) => statusMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,},
    {header: "Importo", accessor: "amount",render: (value) => <Badge variant={"gadBlue"}>€ {value}</Badge>},
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
    {header: "Canale", accessor: "gameChannel", render: (value) => channelMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,},
    {header: "Nome", accessor: "gameName"},
    {header: "Stato", accessor: "status", render: (value) => statusContestMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,},
    {header: "Data Censimento", accessor: "insertDate"},
    {header: "Data Aggiornamento", accessor: "updateDate"},
];

//LOR
export const lorTransactionColumns: TableColumn<LorTransaction>[] = [
    {header: "Tipologia", accessor: "contestType", render: (value) => typeMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,},
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
    {header: "Tipologia", accessor: "contestType", render: (value) => typeMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,},
    {header: "Concorso", accessor: "contestCode"},
    {header: "Data Chiusura", accessor: "closureDate"},
    {header: "Giocate Vincenti", accessor: "winningBets"},
    {header: "Processato", accessor: "processed",render: (value) => processedMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,},
];
export const lorWinningListsColumns: TableColumn<LorWinning>[] = [
    {header: "Tipologia", accessor: "contestType", render: (value) => typeMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,},
    {header: "Concorso", accessor: "contestCode"},
    // {header: "ID", accessor: "id"},
    {header: "Data Comunicazione", accessor: "communicationDate"},
    {header: "Processato", accessor: "processed",render: (value) => processedMapping[String(value)] || <Badge variant={"default"}>{value || "No Type"}</Badge>,},
    {header: "Notificata", accessor: "notified",  render: (value) => notificationMapping[String(value)] || <Badge variant={"default"}>{value}</Badge>,},
];

export const actBonusColumns: TableColumn<ActBonus>[] = [
    {header: "ID", accessor: "ID"},
    {header: "Importo", accessor: "USER_CURRENCY_AMOUNT"},
    {header: "Data Censimento", accessor: "INSERTION_DATE"},
    {header: "Data transazione", accessor: "TRANSACTION_DATE"},
    {header: "Operazione", accessor: "OPERATION_ID"},
    {header: "Calling client ID", accessor: "CALLING_CLIENT_ID"},
    // {header: "Calling system ID", accessor: "CALLING_SYSTEM_ID"},
    // {header: "ID Brand", accessor: "BRAND_ID"},
    // {header: "ID Partner", accessor: "PARTNER_ID"},
    // {header: "Data Creazione KPI", accessor: "KPI_CREATION_DATE"},
    // {header: "Data Update KPI", accessor: "KPI_UPDATE_DATE"},
];

export const actStorniColumns: TableColumn<ActStorni>[] = [
    {header: "ID", accessor: "ID"},
    {header: "Importo", accessor: "USER_CURRENCY_AMOUNT"},
    {header: "Data Censimento", accessor: "INSERTION_DATE"},
    {header: "Data transazione", accessor: "TRANSACTION_DATE"},
    {header: "Operazione", accessor: "OPERATION_ID"},
    {header: "Calling client ID", accessor: "CALLING_CLIENT_ID"},
    // {header: "Calling system ID", accessor: "CALLING_SYSTEM_ID"},
    // {header: "ID Brand", accessor: "BRAND_ID"},
    // {header: "ID Partner", accessor: "PARTNER_ID"},
    // {header: "Data Creazione KPI", accessor: "KPI_CREATION_DATE"},
    // {header: "Data Update KPI", accessor: "KPI_UPDATE_DATE"},
];

export const onpColumns: TableColumn<OnpTransaction>[] = [
    {header: "ID", accessor:"ID"},
    {header: "ID Tipo", accessor:"TXT_TYPE_ID"},
    {header: "ID Istruzione", accessor:"INSTRUCTION_ID"},
    {header: "Conto Gioco", accessor:"CONTRACT_ID"},
    {header: "Operazione", accessor:"OPERATION_ID"},
    {header: "Data", accessor:"TRANSACTION_DATE"},
    {header: "EWL ID", accessor:"EWALLET_TRANSACTION_ID"},
    {header: "EWL REF ID", accessor:"EWALLET_TRANSACTION_REF_ID"},
    {header: "Transazione", accessor:"TRANSACTION_ID"},
    {header: "Importo", accessor:"AMOUNT"},
];

export const ewlColumns: TableColumn<EwlTransaction>[] = [
    {header: "ID Trans Ext", accessor:"TXT_TRANS_EXT_ID"},
    {header: "Operazione", accessor:"OPERATION_ID"},
    {header: "Data", accessor:"DATE_TRANSACTION"},
    {header: "Transazione", accessor:"TRANSACTION_ID"},
    {header: "Importo Utente", accessor:"AMOUNT_USER_EXCHANGE"},
    {header: "Ref ID Associato", accessor:"ASSOCIATED_TRANSACTION_REF_ID"},
    {header:"Metodo Pagamento", accessor:"PSP_METHOD"},
];

export const aperGiurFormColumns: TableColumn<ActStorni>[] = [
    {header: "ID", accessor:"ID"},
    {header: "ID Tipo", accessor:"ID"},
]



//TODO per ewl  filtra solo per date trans e operation id
// per onp  filtra solo per date trans e operation id, contract id

