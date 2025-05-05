//GEV
export interface GevTransaction {
    amount: number,
    contractid: string,
    endDate: string,
    id: string,
    startDate: string,
    status: number,
}

export interface GevRegistryKey {
    clientIp: string,
    contractId: string,
    cryptedData: string,
    registrationDate: string
}

//LDT
export interface LdtTransaction {
    amount: number,
    contractid: string,
    endDate: string,
    id: string,
    startDate: string,
    status: number
}

export interface LdtRegistryKey {
    clientIp: string,
    contractId: string,
    cryptedData: string,
    registrationDate: string
}

export interface LdtContest {
    insertDate: string,
    updateDate: string,
    gameChannel: string,
    gameId: string,
    gameName: string,
    status: string,
    lotteryId: string
}

//LOR
export interface LorTransaction {
    amount: number,
    contractid: string,
    wagerDate: string,
    id: string,
    contestCode: string,
    contestType: string,
}

export interface LorRegistryKey {
    clientIp: string,
    contractId: string,
    cryptedData: string,
    registrationDate: string
}

export interface LorContest {
    contestType: string,
    contestCode: string,
    winningBets: string,
    processed: 1,
    closureDate: string
}

export interface LorWinningList {
    communicationDate: string,
    contestCode: string,
    contestType: string,
    id: number,
    notified: number,
    processed: number
}

//VIRTUAL
export interface VirtualTransaction {
    id: string,
    ticketId: string,
    contractId: string,
    amount: number,
    transactionDate: string,
    status: number,
}

//ACT
export interface EwlTransaction {
    TRANSACTION_ID: number,
    OPERATION_ID: number,
    TXT_TRANS_EXT_ID: string,
    DATE_TRANSACTION: string,
    ASSOCIATED_TRANSACTION_REF_ID: number,
    EXCHANGE_USER_RATE: number,
    AMOUNT_USER_EXCHANGE: number,
    PSP_METHOD: string
}

export interface OnpTransaction {
    ID: number,
    TXT_TYPE_ID: number,
    INSTRUCTION_ID: number,
    CONTRACT_ID: string,
    OPERATION_ID: number,
    TRANSACTION_DATE: string,
    EWALLET_TRANSACTION_ID: number,
    EWALLET_TRANSACTION_REF_ID: number,
    TRANSACTION_ID: string,
    AMOUNT: number,
}

export interface ActBonus {
    ID: number,
    USER_CURRENCY_AMOUNT: number,
    INSERTION_DATE: string,
    TRANSACTION_DATE: string,
    OPERATION_ID: number,
    CALLING_SYSTEM_ID: number,
    CALLING_CLIENT_ID: string,
    BRAND_ID: number,
    PARTNER_ID: number,
    KPI_CREATION_DATE: string,
    KPI_UPDATE_DATE: string
}

export interface ActStorni {
    ID: number,
    USER_CURRENCY_AMOUNT: number,
    INSERTION_DATE: string,
    TRANSACTION_DATE: string,
    OPERATION_ID: number,
    CALLING_SYSTEM_ID: number,
    CALLING_CLIENT_ID: string,
    BRAND_ID: number,
    PARTNER_ID: number,
    KPI_CREATION_DATE: string,
    KPI_UPDATE_DATE: string
}

// TableColumn.ts
export interface TableColumn<T, K extends keyof T = keyof T> {
    /** Testo da mostrare nell'intestazione della colonna */
    header: string;
    /** Chiave dell'oggetto dati da utilizzare per ottenere il valore della cella */
    accessor: K;
    /**
     * Funzione opzionale per personalizzare il rendering della cella.
     * Riceve il valore (di tipo T[K]) e l'intero oggetto della riga.
     */
    render?: (value: T[K], row: T) => React.ReactNode;
}

export interface FilterField<T> {
    field: keyof T;
    label: string;
    type?: "text" | "number" | "date" | "select" | "daterange";
    options?: { label: string; value: string }[]; // usato se type === "select"
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

//VIRTUAL DETAIL

export interface VirtualTransactionDetail {
    id: string;
    ticketId: string;
    wagerAmount: number;     // importo scommesso
    winAmount: number;       // importo vinto
    refundAmount: number;    // importo rimborsato
    ticketStatus: number;    // stato del ticket (es. 3)
    bets: VirtualBet[];             // elenco delle puntate
    systems: VirtualSystem[];       // elenco dei sistemi
    transactions: VirtualTransactionsDetail[]; // elenco delle transazioni
}

export interface VirtualBet {
    bet: string;
    betid: number;
    bonusFlag: number;
    event: number;
    eventDate: string;
    eventDescription: string;
    fixedEvent: number;
    palimpsest: number;
    platformDescription: string;
    platformId: number;
    results: string;
    resultsDescription: string;
    ticketId: string;
    wagerAmount: number;
}

export interface VirtualSystem {
    systemId: number;
    ticketId: string;
    systemType: number;
    base: number;
    combinations: number;
    minWin: number;
    minBonusWin: number;
    maxWin: number;
    maxBonusWin: number;
}

export interface VirtualTransactionsDetail {
    id: string;
    type: string;
    date: string;
    cmdTransaction: string | null;
}

//LOR WINNING DETAIL
export interface LorWinningDetail {
    id: number;
    contestType: string;
    contestCode: string;
    insertDate: string;
    winningBets: LorWinningBetsTransaction[];
}

export interface LorWinningBetsTransaction {
    transactionId: string;
    betId: string;
    winningType: number;
    grossImport: number;
    netImport: number;
    creditImport: number;
}

//SACS

export interface SacsMovementSummary {
    causal: number;
    operationNumber: number;
    amount: number;
}

export interface SacsServiceOperation {
    causal: string,
    numeroOperazioni: number
}

export interface SacsSelfExcludedAccount {
    contractId: string,
    selfExclusionType: number,
    insertDate: string,
    startDate: string,
    endDate: string
}

export interface SacsDormantAccount {
    contractId: string,
    amount: number,
    insertDate: string,
}

export interface SacsWithoutSubregistrationAccount {
    codiceConto: string,
    idCnConto: number,
    idReteConto: number
}



