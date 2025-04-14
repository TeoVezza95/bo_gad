import {Pagination, VirtualTransaction, VirtualTransactionDetail} from "@/interfaces.ts";
import axios from "axios";
import {properties} from "../../properties.ts";
import {formattedDate} from "@/lib/utils.ts";

// Aggiornato per includere paginazione nel body
export const virtualTransactions = async (
    filters: Record<string, unknown> = {},
    page: number = 1,
    pageSize: number = 10,
): Promise<{ transactions: VirtualTransaction[]; pagination: Pagination; }> => {
    const response = await axios.post(
        `${properties.rest.virtual.baseUrl}${properties.rest.virtual.transactions}`,
        {filters, page, pageSize}
    );

    console.log("test virtualtrans ", filters, page, pageSize);


    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        const transactions = response.data.data || response.data;
        transactions.forEach((transaction: VirtualTransaction) => {
            if (transaction.transactionDate) {
                transaction.transactionDate = formattedDate(transaction.transactionDate);
            }
            if (transaction.amount) {
                transaction.amount = (transaction.amount / 100);
            }
        });
        const pagination = {page: response.data.page, pageSize: response.data.pageSize, total: response.data.total}
        return {transactions, pagination};
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.virtual.transactions}`);
};


export const virtualDetailTransaction = async (
    id: string
): Promise<VirtualTransactionDetail> => {
    const response = await axios.post(
        `${properties.rest.virtual.baseUrl}${properties.rest.virtual.transactionDetail}`,
        {id}
    );

    if (response && response.data) {
        // Presupponiamo che il backend restituisca un oggetto con proprietà "data"
        return response.data.data || response.data;
    }
    throw new Error(`Risposta non valida dal server per ${properties.rest.virtual.transactionDetail}`);
};

// export const virtualTransactionSummary = async () => {
//     const response = await axios.get(
//         `${properties.rest.virtual.baseUrl}${properties.rest.virtual.transactions}${properties.rest.virtual.summary}`
//     );
//
//     if (response && response.data) {
//         // L'endpoint summary non utilizza la paginazione
//         const transactions = response.data.transactions || response.data;
//         console.log("test virtualtrans summary ", response);
//         return transactions;
//     }
//     throw new Error(
//         `Risposta non valida dal server per ${properties.rest.virtual.transactions}${properties.rest.virtual.summary}`
//     );
// };
