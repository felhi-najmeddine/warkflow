"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const semiLavorato_1 = __importDefault(require("./routes/semiLavorato"));
const ordine_1 = __importDefault(require("./routes/ordine"));
const prelievoRoutes_1 = __importDefault(require("./routes/prelievoRoutes"));
const movimenti_1 = __importDefault(require("./routes/movimenti"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Importazione del middleware per la gestione degli errori
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api/semi-lavorati', semiLavorato_1.default);
app.use('/api/ordini', ordine_1.default);
app.use('/api/prelievi', prelievoRoutes_1.default);
app.use('/api/movimenti', movimenti_1.default);
// Rotta base per verifica funzionamento server
app.get('/', (_req, res) => {
    res.send('✅ Server avviato correttamente');
});
// Middleware per la gestione centralizzata degli errori
app.use(errorHandler_1.errorHandler);
exports.default = app;
