import {
    Pagination, SacsDormantAccount,
    SacsMovementSummary, SacsSelfExcludedAccount, SacsServiceOperation, SacsWithoutSubregistrationAccount,
    VirtualTransaction,
} from "@/interfaces.ts";
import axios from "axios";
import {properties} from "../../properties.ts";
import {formattedDate} from "@/lib/utils.ts";


export const sacsMovementsSummary = async (): Promise<{
    movements: SacsMovementSummary[];
}> => {
    const response = await axios.post(
        `${properties.rest.sacs.baseUrl}${properties.rest.sacs.riepilogo_movimentazioni}`,
    );

    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const movements = response.data.data || response.data;
        movements.forEach((movement: VirtualTransaction) => {
            if (movement.amount) {
                movement.amount = (movement.amount / 100);
            }
        });
        return {movements};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.sacs.riepilogo_movimentazioni}`);
};

export const sacsServiceOperations = async (): Promise<{
    serviceOperations: SacsServiceOperation[];
}> => {
    const response = await axios.post(
        `${properties.rest.sacs.baseUrl}${properties.rest.sacs.riepilogo_operazioni_servizio}`,
    );

    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const serviceOperations = response.data.data || response.data;
        return {serviceOperations};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.sacs.riepilogo_operazioni_servizio}`);
};

export const sacsSelfExcludedAccounts = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ selfExcludedAccounts: SacsSelfExcludedAccount[]; pagination: Pagination; }> => {
    const response = await axios.post(
        `${properties.rest.sacs.baseUrl}${properties.rest.sacs.conti_autoesclusi}`,
        {filters, page, pageSize}
    );

    console.log("test autoesclusi ", filters, page, pageSize);


    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const selfExcludedAccounts = response.data.data || response.data;
        selfExcludedAccounts.forEach((selfExcludedAccount: SacsSelfExcludedAccount) => {
            if (selfExcludedAccount.startDate) {
                selfExcludedAccount.startDate = formattedDate(selfExcludedAccount.startDate);
            }
            if (selfExcludedAccount.insertDate) {
                selfExcludedAccount.insertDate = formattedDate(selfExcludedAccount.insertDate);
            }
            if (selfExcludedAccount.endDate) {
                selfExcludedAccount.endDate = formattedDate(selfExcludedAccount.endDate);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {selfExcludedAccounts, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.sacs.conti_autoesclusi}`);
};

export const sacsDormantAccounts = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ dormantAccounts: SacsDormantAccount[]; pagination: Pagination; }> => {
    const response = await axios.post(
        `${properties.rest.sacs.baseUrl}${properties.rest.sacs.conti_dormienti}`,
        {filters, page, pageSize}
    );

    console.log("test dormienti ", filters, page, pageSize);


    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const dormantAccounts = response.data.data || response.data;
        dormantAccounts.forEach((dormantAccount: SacsDormantAccount) => {
            if (dormantAccount.insertDate) {
                dormantAccount.insertDate = formattedDate(dormantAccount.insertDate);
            }
            if (dormantAccount.amount) {
                dormantAccount.amount = (dormantAccount.amount / 100);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {dormantAccounts, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.sacs.conti_dormienti}`);
};

export const sacsWithoutSubregistrationAccounts = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ accounts: SacsWithoutSubregistrationAccount[]; pagination: Pagination; }> => {
    const response = await axios.post(
        `${properties.rest.sacs.baseUrl}${properties.rest.sacs.conti_senza_subregistrazione}`,
        {filters, page, pageSize}
    );

    console.log("test senzasub ", filters, page, pageSize);

    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const accounts = response.data.data || response.data;
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {accounts, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.sacs.conti_senza_subregistrazione}`);
};