import axios from "axios";
import {properties} from "../../properties.ts";
import {LdtContest, LdtRegistryKey, LdtTransaction, Pagination} from "@/interfaces.ts";
import {formattedDate} from "@/lib/utils.ts";

//LDT
export const ldtTransactions = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ transactions: LdtTransaction[]; pagination: Pagination; }> => {

    const response = await axios.post(properties.rest.ldt.baseUrl + properties.rest.ldt.transactions, {
        filters,
        page,
        pageSize
    });

    if (response && response.data) {
        const transactions = response.data.data || response.data;
        transactions.forEach((transaction: LdtTransaction) => {
            if (transaction.startDate) {
                transaction.startDate = formattedDate(transaction.startDate);
            }
            if (transaction.endDate) {
                transaction.endDate = formattedDate(transaction.endDate);
            }
            if(transaction.amount) {
                transaction.amount = (transaction.amount / 100);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {transactions, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.ldt.transactions}`);
}

export const ldtRegistryKeys = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ registrationKeys: LdtRegistryKey[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.ldt.baseUrl}${properties.rest.ldt.registerKeys}`, {
        filters,
        page,
        pageSize
    });

    if (response && response.data) {
        const registrationKeys = response.data.data || response.data;
        registrationKeys.forEach((registryKey: LdtRegistryKey) => {
            if (registryKey.registrationDate) {
                registryKey.registrationDate = formattedDate(registryKey.registrationDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {registrationKeys, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.ldt.registerKeys}`);
}

export const ldtContests = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ contests: LdtContest[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.ldt.baseUrl}${properties.rest.ldt.contests}`, {
        filters,
        page,
        pageSize
    });

    if (response && response.data) {
        const contests = response.data.data || response.data;
        contests.forEach((contest: LdtContest) => {
            if (contest.insertDate) {
                contest.insertDate = formattedDate(contest.insertDate);
            }
            if (contest.updateDate) {
                contest.updateDate = formattedDate(contest.updateDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {contests, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.ldt.contests}`);
}

export const ldtTransactionSummary = async () => {

    const response = await axios.get(`${properties.rest.ldt.baseUrl}${properties.rest.ldt.transactions}${properties.rest.ldt.summary}`, {});

    if (response && response.data) {
        const transactions = response.data.transactions || response.data; // Fallback in caso di struttura diversa
        console.log("test LDT trans summary ", response)
        return transactions;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.ldt.transactions}${properties.rest.ldt.summary}`);
}
