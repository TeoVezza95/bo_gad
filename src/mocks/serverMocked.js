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
    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) return res.sendStatus(403);
        next();
    });
}

// Endpoint di Login
app.post("/login", async (req, res) => {
    const {username, password} = req.body;

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
app.post("/logout", (req, res) => {
    res.status(201).json({message: "Logout completed"});
});

// Rotta protetta
app.get("/protected", authenticateToken, (req, res) => {
    res.send("This is a protected route");
});

// Refresh del token
app.post("/login/refresh-jwt-token", (req, res) => {
    const token = req.body.refreshToken;
    if (token == null) return res.status(401).send("No token provided");

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send("Invalid token");
        const accessToken = jwt.sign({username: user.username}, SECRET_KEY, {expiresIn: "15m"});
        res.json({accessToken});
    });
});

// ====================================================
// Funzione helper per la paginazione
// ====================================================
function paginate(data, page = 1, pageSize = 10) {
    const total = data.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    return {total, page, pageSize, data: paginatedData};
}


// ====================================================
// Endpoints per la lettura dei file JSON con filtri (con paginazione nel body)
// (Gli endpoint summary rimangono invariati)
// ====================================================

/**
 * Funzione per leggere un file JSON e applicare dei filtri.
 * @param filePath Il percorso del file JSON.
 * @param keyObj La chiave dell'oggetto JSON da filtrare.
 * @param filters I filtri da applicare.
 * @returns I dati filtrati o l'intero oggetto JSON.
 */
const loadAndFilterData = (filePath, keyObj, filters) => {
    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);

        if (!filters || Object.keys(filters).length === 0) {
            return keyObj ? jsonData[keyObj] : jsonData;
        }

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
            );
        }

        return filteredData || (keyObj ? jsonData[keyObj] : jsonData);
    } catch (err) {
        console.error(`Errore nella lettura/parsing del file: ${filePath}`, err);
        return {error: "Errore interno del server"};
    }
};

// Endpoint con paginazione per GRT-GEV
app.post("/gev_transactions", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-GEV/gev_transactions.json"),
        "transactions",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/gev_registry_keys", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-GEV/gev_registry_keys.json"),
        "registerKeys",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

// GRT-LDT endpoints
app.post("/ldt_transactions", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LDT/ldt_transactions.json"),
        "transactions",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/ldt_registry_keys", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LDT/ldt_registry_keys.json"),
        "registerKeys",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/ldt_contests", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LDT/ldt_contests.json"),
        "contests",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

// GRT-LOR endpoints
app.post("/lor_transactions", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LOR/lor_transactions.json"),
        "transactions",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/lor_registry_keys", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LOR/lor_registry_keys.json"),
        "registerKeys",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/lor_contests", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LOR/lor_contests.json"),
        "contests",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/lor_winning_lists", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-LOR/lor_winning_lists.json"),
        "winningLists",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/lor_winning_list_details", (req, res) => {
    const {id} = req.body;

    if (!id) {
        return res.status(400).json({error: "ID is required"});
    }
    const filePath = path.join(__dirname, "GRT-LOR/lor_winning_list_details.json");

    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);
        // Supponiamo che il file contenga un array di oggetti
        const detail = jsonData.find((item) => item.id === id);

        if (detail) {
            res.json(detail);
        } else {
            res.status(404).json({error: "Winning list detail not found"});
        }
    } catch (err) {
        console.error("Errore nella lettura del file:", err);
        res.status(500).json({error: "Internal server error"});
    }
});

// Endpoint con paginazione per GRT-VIRTUAL
app.post("/virtual_transactions", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "GRT-VIRTUAL/virtual_transactions.json"),
        "transactions",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/virtual_transaction_details", (req, res) => {
    const {id} = req.body;

    if (!id) {
        return res.status(400).json({error: "ID is required"});
    }
    const filePath = path.join(__dirname, "GRT-VIRTUAL/virtual_transaction_details.json");

    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);
        // Supponiamo che il file contenga un array di oggetti
        const detail = jsonData.find((item) => item.id === id);

        if (detail) {
            res.json(detail);
        } else {
            res.status(404).json({error: "Transaction detail not found"});
        }
    } catch (err) {
        console.error("Errore nella lettura del file:", err);
        res.status(500).json({error: "Internal server error"});
    }
});


// ACT endpoints
app.post("/ewl_transactions", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "ACT/EWL_TRANSACTION.json"),
        "",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/onp_transactions", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "ACT/ONP_TRANSACTION.json"),
        "",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/act_bonus", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "ACT/ACT_PSP_BONUS.json"),
        "",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

app.post("/act_storni", (req, res) => {
    const {filters = {}, page = 1, pageSize = 10} = req.body;
    const allData = loadAndFilterData(
        path.join(__dirname, "ACT/ACT_PSP_STORNI.json"),
        "",
        filters
    );
    res.json(paginate(allData, page, pageSize));
});

// ====================================================
// Endpoint Summary (senza paginazione)
// ====================================================

// GRT-GEV summary
app.get("/gev_transactions/summary", (req, res) => {
    const filePath = path.join(__dirname, "GRT-GEV/gev_transactions.json");
    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(rawData);
        const transactions = jsonData["transactions"] || [];

        if (transactions.length === 0) {
            return res.json([]);
        }

        let latestDate = new Date(0);
        transactions.forEach((tx) => {
            const txDate = parseISO(tx.startDate);
            if (isAfter(txDate, latestDate)) {
                latestDate = txDate;
            }
        });

        const last30DaysCount = {};
        for (let i = 0; i < 30; i++) {
            const dateKey = format(subDays(latestDate, i), "yyyy-MM-dd");
            last30DaysCount[dateKey] = 0;
        }

        transactions.forEach((tx) => {
            const txDate = format(parseISO(tx.startDate), "yyyy-MM-dd");
            if (txDate in last30DaysCount) {
                last30DaysCount[txDate]++;
            }
        });

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

// Analoghi summary per LDT e LOR (rimangono invariati)

app.listen(port, () => {
    console.log(`✅ Server in ascolto su http://localhost:${port}`);
});
