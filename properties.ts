// properties.ts
export const properties = {
    rest: {
        gev: {
            baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH
                ? import.meta.env.VITE_BO_GAD_API_BASE_PATH
                : import.meta.env.VITE_MOCK_BASE_PATH,
            transactions: "gev_transactions",
            registerKeys: "gev_registry_keys",
            summary: "/summary"
        },
        ldt: {
            baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH
                ? import.meta.env.VITE_BO_GAD_API_BASE_PATH
                : import.meta.env.VITE_MOCK_BASE_PATH,
            transactions: "ldt_transactions",
            registerKeys: "ldt_registry_keys",
            contests: "ldt_contests",
            summary: "/summary"
        },
        lor: {
            baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH_LOR
                ? import.meta.env.VITE_BO_GAD_API_BASE_PATH_LOR
                : import.meta.env.VITE_MOCK_BASE_PATH,
            transactions: "lor_transactions",
            registerKeys: "lor_registry_keys",
            contests: import.meta.env.VITE_BO_GAD_API_BASE_PATH_LOR ? "contests/search" : "lor_contests",
            winningLists: import.meta.env.VITE_BO_GAD_API_BASE_PATH_LOR ? "winning-lists/search" : "lor_winning_lists",
            winningListDetail: "lor_winning_list_details",
            summary: "/summary"
        },
        virtual: {
            baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH
                ? import.meta.env.VITE_BO_GAD_API_BASE_PATH
                : import.meta.env.VITE_MOCK_BASE_PATH,
            transactions: "virtual_transactions",
            transactionDetail: "virtual_transaction_details",
        },
        act: {
            baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH
                ? import.meta.env.VITE_BO_GAD_API_BASE_PATH
                : import.meta.env.VITE_MOCK_BASE_PATH,
            ewl_transactions: "ewl_transactions",
            onp_transactions: "onp_transactions",
            bonus: "act_bonus",
            storni: "act_storni",
        },
        sacs: {
            baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH
                ? import.meta.env.VITE_BO_GAD_API_BASE_PATH
                : import.meta.env.VITE_MOCK_BASE_PATH,
            riepilogo_movimentazioni: "riepilogo_movimentazioni",
            riepilogo_operazioni_servizio: "riepilogo_operazioni_servizio",
            conti_autoesclusi: "conti_autoesclusi",
            conti_dormienti: "conti_dormienti",
            conti_senza_subregistrazione: "conti_senza_subregistrazione",
        }
    },
    login: {
        baseUrl: import.meta.env.VITE_BO_GAD_API_BASE_PATH
            ? import.meta.env.VITE_BO_GAD_API_BASE_PATH
            : import.meta.env.VITE_MOCK_BASE_PATH,
        loginUrl: "login",
        logoutUrl: "logout",
        refreshToken: "login/refresh-jwt-token",
        refreshTokenExpireIn: 172800000, // 2 giorni in ms
        accessTokenExpireIn: 3600000 // 60 min in ms
    }
};
