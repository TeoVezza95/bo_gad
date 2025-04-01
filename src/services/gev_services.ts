//GEV
import {GevRegistryKey, GevTransaction} from "@/interfaces.ts";
import axios from "axios";
import {properties} from "../../properties.ts";
import {formattedDate} from "@/lib/utils.ts";

export const gevTransactions = async (filters: Record<string, unknown> = {}): Promise<GevTransaction[]> => {

    const response = await axios.post(`${properties.rest.gev.baseUrl}${properties.rest.gev.transactions}`, {filters});

    console.log("test gevtrans ",filters)

    if (response && response.data) {
        const transactions = response.data.transactions || response.data; // Fallback in caso di struttura diversa
        transactions.forEach((transaction: GevTransaction) => {
            if (transaction.startDate) {
                transaction.startDate = formattedDate(transaction.startDate);
            }
            if (transaction.endDate) {
                transaction.endDate = formattedDate(transaction.endDate);
            }
        });
        return transactions;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.gev.transactions}`);
};

export const gevRegistryKeys = async (filters: Record<string, unknown> = {}): Promise<GevRegistryKey[]> => {

    console.log("test gevRegKey ",filters)


    const response = await axios.post(`${properties.rest.gev.baseUrl}${properties.rest.gev.registerKeys}`, {filters});

    if (response && response.data) {
        const registrationKeys = response.data.registerKeys || response.data;

        registrationKeys.forEach((registryKey: GevRegistryKey) => {
            if (registryKey.registrationDate) {
                registryKey.registrationDate = formattedDate(registryKey.registrationDate);
            }
        });
        return registrationKeys;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.gev.registerKeys}`);
}

export const gevTransactionSummary = async () => {

    const response = await axios.get(`${properties.rest.gev.baseUrl}${properties.rest.gev.transactions}${properties.rest.gev.summary}`, {});

    if (response && response.data) {
        const transactions = response.data.transactions || response.data; // Fallback in caso di struttura diversa
        console.log("test gevtrans summary ",response)
        return transactions;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.gev.transactions}${properties.rest.gev.summary}`);
}

export const lorTransactionSummary = async () => {

    const response = await axios.get(`${properties.rest.lor.baseUrl}${properties.rest.lor.transactions}${properties.rest.lor.summary}`, {});

    if (response && response.data) {
        const transactions = response.data.transactions || response.data; // Fallback in caso di struttura diversa
        console.log("test gevtrans summary ",response)
        return transactions;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.lor.transactions}${properties.rest.lor.summary}`);
}
