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

export interface LorWinning {
    communicationDate: string,
    contestCode: string,
    contestType: string,
    id: number,
    notified: number,
    processed: number
}

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

export interface OnpTransaction{
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

export interface ActBonus{
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

export interface ActStorni{
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

export interface SacsServiceOperation{
    CAUSAL: string,
    N_OPERATIONS: number
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


