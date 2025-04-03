import axios from "axios";
import {properties} from "../../properties.ts";
import {
    LorContest,
    LorRegistryKey,
    LorTransaction,
    LorWinningList,
    Pagination
} from "@/interfaces.ts";
import {formattedDate} from "@/lib/utils.ts";

//LOR
const lorTransactions = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ transactions: LorTransaction[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.transactions}`, {
        filters,
        page,
        pageSize
    },);

    if (response && response.data) {
        const transactions = response.data.data || response.data;
        transactions.forEach((transaction: LorTransaction) => {
            if (transaction.wagerDate) {
                transaction.wagerDate = formattedDate(transaction.wagerDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {transactions, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.transactions}`);
}

const lorRegistryKeys = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ registrationKeys: LorRegistryKey[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.registerKeys}`, {
        filters,
        page,
        pageSize
    });

    if (response && response.data) {
        const registrationKeys = response.data.data || response.data;
        registrationKeys.forEach((registryKey: LorRegistryKey) => {
            if (registryKey.registrationDate) {
                registryKey.registrationDate = formattedDate(registryKey.registrationDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {registrationKeys, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.registerKeys}`);
}

const lorContests = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ contests: LorContest[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.contests}`, {
        filters,
        page,
        pageSize
    });

    if (response && response.data) {
        const contests = response.data.data || response.data;
        contests.forEach((contest: LorContest) => {
            if (contest.closureDate) {
                contest.closureDate = formattedDate(contest.closureDate);
            }
        });

        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {contests, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.contests}`);
}

const lorWinningLists = async (
    filters: Record<string, unknown> = {},
    page: number,
    pageSize: number):
    Promise<{ winningLists: LorWinningList[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.winningLists}`, {
        filters,
        page,
        pageSize
    });

    if (response && response.data) {
        const winningLists = response.data.data || response.data;
        winningLists.forEach((winner: LorWinningList) => {
            if (winner.communicationDate) {
                winner.communicationDate = formattedDate(winner.communicationDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {winningLists, pagination};
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.winningLists}`);

}

export {lorTransactions, lorRegistryKeys, lorContests, lorWinningLists};