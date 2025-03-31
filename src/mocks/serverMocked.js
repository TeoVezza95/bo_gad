import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {subDays, format, parseISO, isAfter} from "date-fns";

// Ricava __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Abilita CORS e parsing del body JSON
app.use(cors());
app.use(express.json());

// ====================================================
// Autenticazione: Login / Logout / Rotta protetta
// ====================================================


// In-memory store per gli utenti
let users = [];

// Chiave segreta per JWT (sostituisci con una stringa sicura)
const SECRET_KEY = "your-secret-key";

// Middleware per autenticare il token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        // Se necessario, potresti assegnare req.user = user;
        next();
    });
}

// Endpoint di Login
app.post("/login", async (req, res) => {
    const {username, password} = req.body;

    // Se l'utente non esiste, lo registra (in questo esempio, la registrazione avviene in automatico)
    let userExists = users.find((user) => user.username === username);
    if (!userExists) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            users.push({username, password: hashedPassword});
        } catch (err) {
            return res.status(500).send("Error registering user");
        }
    }

    const user = users.find((user) => user.username === username);
    if (!user) {
        return res.status(400).send("Cannot find user");
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            // Crea accessToken e refreshToken
            const accessToken = jwt.sign({username: user.username}, SECRET_KEY, {
                expiresIn: "15m",
            });
            const refreshToken = jwt.sign({username: user.username}, SECRET_KEY, {
                expiresIn: "7d",
            });
            res.json({accessToken, refreshToken});
        } else {
            res.status(403).send("Incorrect password");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Endpoint di Logout
app.post("/logout", async (req, res) => {
    // In un'implementazione reale dovresti invalidare il refresh token.
    // Qui, per semplicità, restituiamo solo un messaggio.
    res.status(201).json({message: "Logout completed"});
});

// Rotta protetta
app.get("/protected", authenticateToken, (req, res) => {
    res.send("This is a protected route");
});

// Refresh del token
app.post('/login/refresh-jwt-token', (req, res) => {
    const token = req.body.refreshToken;
    if (token == null) return res.status(401).send('No token provided');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        const accessToken = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: '15m'});
        res.json({accessToken});
    });
});

// ====================================================
// Endpoints esistenti per la lettura dei file JSON con filtri
// ====================================================

/**
 * Funzione per leggere un file JSON e applicare dei filtri.
 * @param filePath Il percorso del file JSON.
 * @param keyObj La chiave dell'oggetto JSON da filtrare.
 * @param filters I filtri da applicare.
 * @returns I dati filtrati o l'intero oggetto JSON.
 */
const loadAndFilterData = (
    filePath,
    keyObj,
    filters
) => {
    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);

        // Se non ci sono filtri, restituisci tutti i dati
        if (!filters || Object.keys(filters).length === 0) {
            return jsonData;
        }

        console.log("test load", keyObj, filters);
        let filteredData;
        if (keyObj) {
            filteredData = jsonData[keyObj]?.filter((item) =>
                Object.entries(filters).every(([key, value]) =>
                    item[key] ? item[key].toString().includes(value.toString()) : false
                )
            );
        } else {
            filteredData = jsonData.filter((item) =>
                Object.entries(filters).every(([key, value]) =>
                    item[key] ? item[key].toString().includes(value.toString()) : false
                )
            )
        }

        // Applica i filtri sull'array sotto la chiave keyObj, se presente
        return filteredData || jsonData;
    } catch (err) {
        console.error(`Errore nella lettura/parsing del file: ${filePath}`, err);
        return {error: "Errore interno del server"};
    }
};

// 📌 **Endpoint per ottenere il numero di transazioni giornaliere relativi alla data più recente**
app.get("/gev_transactions/summary", (req, res) => {
    const filePath = path.join(__dirname, "GRT-GEV/gev_transactions.json");

    try {
        // 1️⃣ Leggi il file JSON
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);
        const transactions = jsonData["transactions"] || [];

        if (transactions.length === 0) {
            return res.json([]);
        }

        // 2️⃣ Trova la data più recente tra tutte le transazioni
        let latestDate = new Date(0); // Data iniziale molto vecchia
        transactions.forEach((tx) => {
            const txDate = parseISO(tx.startDate);
            if (isAfter(txDate, latestDate)) {
                latestDate = txDate;
            }
        });

        // 3️⃣ Creiamo un oggetto per tenere traccia del conteggio giornaliero
        const last30DaysCount = {};

        // 4️⃣ Genera le date per gli ultimi 30 giorni basati sulla `latestDate`
        for (let i = 0; i < 30; i++) {
            const dateKey = format(subDays(latestDate, i), "yyyy-MM-dd");
            last30DaysCount[dateKey] = 0; // Inizializza il conteggio a 0
        }

        // 5️⃣ Conta le transazioni per ogni giorno negli ultimi 10 giorni
        transactions.forEach((tx) => {
            const txDate = format(parseISO(tx.startDate), "yyyy-MM-dd");

            if (txDate in last30DaysCount) {
                last30DaysCount[txDate]++;
            }
        });

        // 6️⃣ Converti l'oggetto in un array formattato
        const result = Object.keys(last30DaysCount).map((date) => ({
            date,
            gevTransactions: last30DaysCount[date],
        }));

        res.json(result);
    } catch (error) {
        console.error("Errore nel caricamento delle transazioni:", error);
        res.status(500).json({error: "Errore interno del server"});
    }
});


// 📌 **GRT-GEV**
app.post("/gev_transactions", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-GEV/gev_transactions.json"),
            "transactions",
            filters
        )
    );
});

app.post("/gev_registry_keys", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-GEV/gev_registry_keys.json"),
            "registerKeys",
            filters
        )
    );
});

// 📌 **Endpoint per ottenere il numero di transazioni giornaliere relativi alla data più recente**
app.get("/ldt_transactions/summary", (req, res) => {
    const filePath = path.join(__dirname, "GRT-LDT/ldt_transactions.json");

    try {
        // 1️⃣ Leggi il file JSON
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);
        const transactions = jsonData["transactions"] || [];

        if (transactions.length === 0) {
            return res.json([]);
        }

        // 2️⃣ Trova la data più recente tra tutte le transazioni
        let latestDate = new Date(0); // Data iniziale molto vecchia
        transactions.forEach((tx) => {
            const txDate = parseISO(tx.startDate);
            if (isAfter(txDate, latestDate)) {
                latestDate = txDate;
            }
        });

        // 3️⃣ Creiamo un oggetto per tenere traccia del conteggio giornaliero
        const last30DaysCount = {};

        // 4️⃣ Genera le date per gli ultimi 10 giorni basati sulla `latestDate`
        for (let i = 0; i < 30; i++) {
            const dateKey = format(subDays(latestDate, i), "yyyy-MM-dd");
            last30DaysCount[dateKey] = 0; // Inizializza il conteggio a 0
        }

        // 5️⃣ Conta le transazioni per ogni giorno negli ultimi 30 giorni
        transactions.forEach((tx) => {
            const txDate = format(parseISO(tx.startDate), "yyyy-MM-dd");

            if (txDate in last30DaysCount) {
                last30DaysCount[txDate]++;
            }
        });

        // 6️⃣ Converti l'oggetto in un array formattato
        const result = Object.keys(last30DaysCount).map((date) => ({
            date,
            ldtTransactions: last30DaysCount[date],
        }));

        res.json(result);
    } catch (error) {
        console.error("Errore nel caricamento delle transazioni:", error);
        res.status(500).json({error: "Errore interno del server"});
    }
});

// 📌 **GRT-LDT**
app.post("/ldt_transactions", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LDT/ldt_transactions.json"),
            "transactions",
            filters
        )
    );
});

app.post("/ldt_registry_keys", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LDT/ldt_registry_keys.json"),
            "registerKeys",
            filters
        )
    );
});

app.post("/ldt_contests", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LDT/ldt_contests.json"),
            "contests",
            filters
        )
    );
});

// 📌 **GRT-LOR**
app.post("/lor_transactions", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LOR/lor_transactions.json"),
            "transactions",
            filters
        )
    );
});

app.post("/lor_registry_keys", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LOR/lor_registry_keys.json"),
            "registerKeys",
            filters
        )
    );
});

app.post("/lor_contests", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LOR/lor_contests.json"),
            "contests",
            filters
        )
    );
});

app.post("/lor_winning_lists", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "GRT-LOR/lor_winning_lists.json"),
            "winningLists",
            filters
        )
    );
});

// 📌 **ACT**
app.post("/ewl_transactions", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "ACT/EWL_TRANSACTION.json"),
            "",
            filters
        )
    );
});

app.post("/onp_transactions", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "ACT/ONP_TRANSACTION.json"),
            "",
            filters
        )
    );
});

app.post("/act_bonus", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "ACT/ACT_PSP_BONUS.json"),
            "",
            filters
        )
    );
});

app.post("/act_storni", (req, res) => {
    const filters = req.body?.filters || {};
    res.json(
        loadAndFilterData(
            path.join(__dirname, "ACT/ACT_PSP_STORNI.json"),
            "",
            filters
        )
    );
});

// ====================================================
// Avvio del server
// ====================================================
app.listen(port, () => {
    console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
