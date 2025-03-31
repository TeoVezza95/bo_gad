import React, { createContext, useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { doLogout } from "@/services/login_services.ts";
import { properties } from "../../properties";

// Definizione del tipo per il contesto di autenticazione
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (accessToken: string, refreshToken: string, values: User) => void;
    logout: () => void;
    loading: boolean;
}

// Definizione del tipo per un utente (adatta alle tue necessità)
interface User {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: unknown; // Campi dinamici opzionali
}

// Creazione del contesto con un valore iniziale nullo
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Per gestire il timeout

    const refreshTokenExpireIn = properties.login.refreshTokenExpireIn;
    const accessTokenExpireIn = properties.login.accessTokenExpireIn;
    const REFRESH_TOKEN_API = `${properties.login.baseUrl}${properties.login.refreshToken}`;

    // Clonazione profonda di un oggetto (non necessario con TypeScript, ma lasciato per compatibilità)
    // const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

    // Imposta il timeout per aggiornare il token prima della scadenza
    const setupTokenRefresh = (accessExpiryTime: number) => {
        const currentTime = Date.now();
        const timeUntilExpiry = accessExpiryTime - currentTime;

        if (timeUntilExpiry <= 0) return; // Se il tempo è già scaduto, non fare nulla

        const refreshTime = timeUntilExpiry - timeUntilExpiry * 0.1; // 10% prima della scadenza

        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        refreshTimeoutRef.current = setTimeout(() => {
            const refreshToken = sessionStorage.getItem("refreshToken");
            if (refreshToken) {
                refreshAccessToken(refreshToken);
            }
        }, refreshTime);
    };

    const login = (accessToken: string, refreshToken: string, values: User) => {
        console.log("Login - Access Token:", accessToken);
        console.log("Login - Refresh Token:", refreshToken);

        const accessExpiryTime = Date.now() + accessTokenExpireIn;

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("accessExpiry", accessExpiryTime.toString());
        sessionStorage.setItem("refreshExpiry", (Date.now() + refreshTokenExpireIn).toString());

        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setIsAuthenticated(true);
        setLoading(false);
        setUser(values);

        // Imposta il timeout per aggiornare il token prima della scadenza
        setupTokenRefresh(accessExpiryTime);
    };

    const logout = () => {
        if (user) {
            doLogout(user)
                .catch((error) => console.log("ERROR", error))
                .then((r) => console.log("Logout - Access Token:", r));
        }

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessExpiry");
        sessionStorage.removeItem("refreshExpiry");
        delete axios.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);

        // Pulisci il timeout quando si effettua il logout
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }
    };

    const refreshAccessToken = async (refreshToken: string) => {
        try {
            const response = await axios.post(REFRESH_TOKEN_API, { refreshToken });
            const { accessToken } = response.data;
            const newAccessExpiryTime = Date.now() + accessTokenExpireIn;

            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("accessExpiry", newAccessExpiryTime.toString());
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            setIsAuthenticated(true);
            setLoading(false);

            // Reimposta il timeout per il nuovo token
            setupTokenRefresh(newAccessExpiryTime);
        } catch (error) {
            console.error("Failed to refresh access token", error);
            logout();
            setLoading(false);
        }
    };

    const isTokenExpired = (expiry: string | null): boolean => {
        return expiry ? Date.now() > parseInt(expiry) : true;
    };

    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        const refreshToken = sessionStorage.getItem("refreshToken");
        const accessExpiry = sessionStorage.getItem("accessExpiry");
        const refreshExpiry = sessionStorage.getItem("refreshExpiry");

        console.log("useEffect - Access Token:", accessToken);
        console.log("useEffect - Refresh Token:", refreshToken);
        console.log("useEffect - Access Expiry:", accessExpiry);
        console.log("useEffect - Refresh Expiry:", refreshExpiry);

        if (accessToken && accessExpiry && !isTokenExpired(accessExpiry)) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            setIsAuthenticated(true);
            setLoading(false);

            // Imposta il timeout per aggiornare il token prima della scadenza
            setupTokenRefresh(parseInt(accessExpiry));
        } else if (refreshToken && refreshExpiry && !isTokenExpired(refreshExpiry)) {
            setLoading(true);
            refreshAccessToken(refreshToken);
        } else {
            logout();
            setLoading(false);
        }

        // Cleanup del timeout quando il componente viene smontato
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
