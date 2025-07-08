"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/createUser.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const Utente_1 = __importDefault(require("../src/models/Utente"));
const database_1 = __importDefault(require("../src/config/database"));
function createUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connessione al database
            yield database_1.default.authenticate();
            console.log('Connessione al DB riuscita');
            // Verifica se l'utente esiste già
            const existingUser = yield Utente_1.default.findOne({ where: { username } });
            if (existingUser) {
                console.log('Utente già esistente');
                return;
            }
            // Crittografia della password
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
            // Creazione del nuovo utente
            const newUser = yield Utente_1.default.create({
                username,
                passwordHash
            });
            console.log(`Utente creato con ID: ${newUser.id}`);
        }
        catch (error) {
            // Gestione degli errori
            console.error('Errore:', error);
        }
        finally {
            // Chiusura della connessione al DB
            yield database_1.default.close();
        }
    });
}
// Recupera i parametri da riga di comando
const username = process.argv[2];
const password = process.argv[3];
// Controlla che username e password siano forniti
if (!username || !password) {
    console.log('Uso: ts-node scripts/createUser.ts <username> <password>');
    process.exit(1);
}
// Esegue la funzione per creare l'utente
createUser(username, password);
