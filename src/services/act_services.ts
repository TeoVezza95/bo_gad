//ACT
import {ActBonus, ActStorni, EwlTransaction, OnpTransaction, Pagination} from "@/interfaces.ts";
import axios from "axios";
import {properties} from "../../properties.ts";
import {formattedDate} from "@/lib/utils.ts";

export const ewlTransactions = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ transactions: EwlTransaction[]; pagination: Pagination; }> => {
    const response = await axios.post(`${properties.rest.act.baseUrl}${properties.rest.act.ewl_transactions}`, {
        filters,
        page,
        pageSize
    });

    console.log("test ewl ", filters)

    if (response && response.data) {
        const transactions = response.data.data || response.data; // Fallback in caso di struttura diversa
        transactions.forEach((transaction: EwlTransaction) => {
            if (transaction.DATE_TRANSACTION) {
                transaction.DATE_TRANSACTION = formattedDate(transaction.DATE_TRANSACTION);
            }
            if (transaction.AMOUNT_USER_EXCHANGE) {
                transaction.AMOUNT_USER_EXCHANGE = transaction.AMOUNT_USER_EXCHANGE / 100;
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {transactions, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.act.ewl_transactions}`);
};

export const onpTransactions = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ transactions: OnpTransaction[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.act.baseUrl}${properties.rest.act.onp_transactions}`, {
        filters,
        page,
        pageSize
    });

    console.log("test onp ", filters)

    if (response && response.data) {
        const transactions = response.data.data || response.data; // Fallback in caso di struttura diversa
        transactions.forEach((transaction: OnpTransaction) => {
            if (transaction.TRANSACTION_DATE) {
                transaction.TRANSACTION_DATE = formattedDate(transaction.TRANSACTION_DATE);
            }
            if (transaction.AMOUNT) {
                transaction.AMOUNT = transaction.AMOUNT / 100;
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {transactions, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.act.onp_transactions}`);
};

export const actBonus = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ actBonus: ActBonus[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.act.baseUrl}${properties.rest.act.bonus}`, {
        filters,
        page,
        pageSize
    });

    console.log("test act bonus ", filters)

    if (response && response.data) {
        const actBonus = response.data.data || response.data; // Fallback in caso di struttura diversa
        actBonus.forEach((bonus: ActBonus) => {
            if (bonus.INSERTION_DATE) {
                bonus.INSERTION_DATE = formattedDate(bonus.INSERTION_DATE);
            }
            if (bonus.KPI_CREATION_DATE) {
                bonus.KPI_CREATION_DATE = formattedDate(bonus.KPI_CREATION_DATE);
            }
            if (bonus.KPI_UPDATE_DATE) {
                bonus.KPI_UPDATE_DATE = formattedDate(bonus.KPI_UPDATE_DATE);
            }
            if (bonus.TRANSACTION_DATE) {
                bonus.TRANSACTION_DATE = formattedDate(bonus.TRANSACTION_DATE);
            }
            if (bonus.USER_CURRENCY_AMOUNT) {
                bonus.USER_CURRENCY_AMOUNT = bonus.USER_CURRENCY_AMOUNT / 100
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {actBonus, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.act.bonus}`);
};

export const actStorni = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ actStorni: ActStorni[]; pagination: Pagination; }> => {

    const response = await axios.post(`${properties.rest.act.baseUrl}${properties.rest.act.storni}`, {
        filters,
        page,
        pageSize
    });

    console.log("test act storni ", filters)

    if (response && response.data) {
        const actStorni = response.data.data || response.data; // Fallback in caso di struttura diversa
        actStorni.forEach((storni: ActStorni) => {
            if (storni.INSERTION_DATE) {
                storni.INSERTION_DATE = formattedDate(storni.INSERTION_DATE);
            }
            if (storni.KPI_CREATION_DATE) {
                storni.KPI_CREATION_DATE = formattedDate(storni.KPI_CREATION_DATE);
            }
            if (storni.KPI_UPDATE_DATE) {
                storni.KPI_UPDATE_DATE = formattedDate(storni.KPI_UPDATE_DATE);
            }
            if (storni.TRANSACTION_DATE) {
                storni.TRANSACTION_DATE = formattedDate(storni.TRANSACTION_DATE);
            }
            if (storni.USER_CURRENCY_AMOUNT) {
                storni.USER_CURRENCY_AMOUNT = storni.USER_CURRENCY_AMOUNT / 100
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {actStorni, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.act.storni}`);
};
