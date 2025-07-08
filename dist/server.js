"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const app_1 = __importDefault(require("./app"));
require("./models");
const PORT = process.env.PORT || 3000;
database_1.default.sync({ force: false })
    .then(() => {
    console.log('✅ Tabelle create con successo');
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server avviato su http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ Errore nella creazione delle tabelle:', err);
});
