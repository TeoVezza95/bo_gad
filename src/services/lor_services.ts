import axios from "axios";
import {properties} from "../../properties.ts";
import {LorContest, LorRegistryKey, LorTransaction, LorWinning} from "@/interfaces.ts";
import {formattedDate} from "@/lib/utils.ts";

//LOR
const lorTransactions = async (filters: Record<string, unknown> = {}): Promise<LorTransaction[]> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.transactions}`, {filters},);

    if (response && response.data) {
        const transactions = response.data.transactions || response.data;
        transactions.forEach((transaction: LorTransaction) => {
            if (transaction.wagerDate) {
                transaction.wagerDate = formattedDate(transaction.wagerDate);
            }
        });
        return transactions;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.transactions}`);
}

const lorRegistryKeys = async (filters: Record<string, unknown> = {}): Promise<LorRegistryKey[]> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.registerKeys}`, {filters});

    if (response && response.data) {
        const registrationKeys = response.data.registerKeys || response.data;
        registrationKeys.forEach((registryKey: LorRegistryKey) => {
            if (registryKey.registrationDate) {
                registryKey.registrationDate = formattedDate(registryKey.registrationDate);
            }
        });
        return registrationKeys;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.registerKeys}`);
}

const lorContests = async (filters: Record<string, unknown> = {}): Promise<LorContest[]> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.contests}`, {filters});

    if (response && response.data) {
        const contests = response.data.contests || response.data;
        contests.forEach((contest: LorContest) => {
            if (contest.closureDate) {
                contest.closureDate = formattedDate(contest.closureDate);
            }
        });
        return contests;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.contests}`);
}

const lorWinningLists = async (filters: Record<string, unknown> = {}): Promise<LorWinning[]> => {

    const response = await axios.post(`${properties.rest.lor.baseUrl}${properties.rest.lor.winningLists}`, {filters});

    if (response && response.data) {
        const winningLists = response.data.winningLists || response.data;
        winningLists.forEach((winner: LorWinning) => {
            if (winner.communicationDate) {
                winner.communicationDate = formattedDate(winner.communicationDate);
            }
        });
        return winningLists;
    }
    throw Error(`Invalid response for ldt transaction request ${properties.rest.lor.winningLists}`);

}

export {lorTransactions, lorRegistryKeys, lorContests, lorWinningLists};