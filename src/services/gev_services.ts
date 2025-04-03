import {GevRegistryKey, GevTransaction, Pagination} from "@/interfaces.ts";
import axios from "axios";
import {properties} from "../../properties.ts";
import {formattedDate} from "@/lib/utils.ts";

// Aggiornato per includere paginazione nel body
export const gevTransactions = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ transactions: GevTransaction[]; pagination: Pagination; }> => {
    const response = await axios.post(
        `${properties.rest.gev.baseUrl}${properties.rest.gev.transactions}`,
        {filters, page, pageSize}
    );

    console.log("test gevtrans ", filters, page, pageSize);


    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const transactions = response.data.data || response.data;
        transactions.forEach((transaction: GevTransaction) => {
            if (transaction.startDate) {
                transaction.startDate = formattedDate(transaction.startDate);
            }
            if (transaction.endDate) {
                transaction.endDate = formattedDate(transaction.endDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {transactions, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.gev.transactions}`);
};

export const gevRegistryKeys = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10
): Promise<{ registrationKeys: GevRegistryKey[], pagination: Pagination }> => {
    console.log("test gevRegKey ", filters, page, pageSize);
    const response = await axios.post(
        `${properties.rest.gev.baseUrl}${properties.rest.gev.registerKeys}`,
        {filters, page, pageSize}
    );

    if (response && response.data) {
        const registrationKeys = response.data.data || response.data;
        registrationKeys.forEach((registryKey: GevRegistryKey) => {
            if (registryKey.registrationDate) {
                registryKey.registrationDate = formattedDate(registryKey.registrationDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {registrationKeys, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.gev.registerKeys}`);
};

export const gevTransactionSummary = async () => {
    const response = await axios.get(
        `${properties.rest.gev.baseUrl}${properties.rest.gev.transactions}${properties.rest.gev.summary}`
    );

    if (response && response.data) {
        // L'endpoint summary non utilizza la paginazione
        const transactions = response.data.transactions || response.data;
        console.log("test gevtrans summary ", response);
        return transactions;
    }
    throw new Error(
        `Risposta non valida dal server per ${properties.rest.gev.transactions}${properties.rest.gev.summary}`
    );
};

export const lorTransactionSummary = async () => {
    const response = await axios.get(
        `${properties.rest.lor.baseUrl}${properties.rest.lor.transactions}${properties.rest.lor.summary}`
    );

    if (response && response.data) {
        const transactions = response.data.transactions || response.data;
        console.log("test lortrans summary ", response);
        return transactions;
    }
    throw new Error(
        `Risposta non valida dal server per ${properties.rest.lor.transactions}${properties.rest.lor.summary}`
    );
};
