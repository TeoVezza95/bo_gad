import axios from "axios";
import {properties} from "../../properties.ts";
import {LdtContest, LdtRegistryKey, LdtTransaction} from "@/interfaces.ts";
import {formattedDate} from "@/lib/utils.ts";

//LDT
export const ldtTransactions = async (filters: Record<string, unknown> = {}): Promise<LdtTransaction[]> => {

    const response = await axios.post(properties.rest.ldt.baseUrl + properties.rest.ldt.transactions, {filters});

    if (response && response.data) {
        const transactions = response.data.transactions || response.data;
        transactions.forEach((transaction: LdtTransaction) => {
            if (transaction.startDate) {
                transaction.startDate = formattedDate(transaction.startDate);
            }
            if (transaction.endDate) {
                transaction.endDate = formattedDate(transaction.endDate);
            }
        });
        return transactions;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.ldt.transactions}`);
}

export const ldtRegistryKeys = async (filters: Record<string, unknown> = {}): Promise<LdtRegistryKey[]> => {

    const response = await axios.post(`${properties.rest.ldt.baseUrl}${properties.rest.ldt.registerKeys}`, {filters});

    if (response && response.data) {
        const registrationKeys = response.data.registerKeys || response.data;
        registrationKeys.forEach((registryKey: LdtRegistryKey) => {
            if (registryKey.registrationDate) {
                registryKey.registrationDate = formattedDate(registryKey.registrationDate);
            }
        });
        return registrationKeys;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.ldt.registerKeys}`);
}

export const ldtContests = async (filters: Record<string, unknown> = {}): Promise<LdtContest[]> => {
    const response = await axios.post(`${properties.rest.ldt.baseUrl}${properties.rest.ldt.contests}`, {filters});

    if (response && response.data) {
        const contests = response.data.contests || response.data;
        contests.forEach((contest: LdtContest) => {
            if (contest.insertDate) {
                contest.insertDate = formattedDate(contest.insertDate);
            }
            if (contest.updateDate) {
                contest.updateDate = formattedDate(contest.updateDate);
            }
        });
        return contests;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.ldt.contests}`);
}

export const ldtTransactionSummary = async () => {

    const response = await axios.get(`${properties.rest.ldt.baseUrl}${properties.rest.ldt.transactions}${properties.rest.ldt.summary}`, {});

    if (response && response.data) {
        const transactions = response.data.transactions || response.data; // Fallback in caso di struttura diversa
        console.log("test LDT trans summary ",response)
        return transactions;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.ldt.transactions}${properties.rest.ldt.summary}`);
}
