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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Utente_1 = __importDefault(require("../models/Utente"));
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const JWT_EXPIRATION = '1h'; // مدة صلاحية التوكن
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Username e password sono obbligatori' });
        return;
    }
    try {
        const user = yield Utente_1.default.findOne({ where: { username } });
        if (!user) {
            res.status(401).json({ message: 'Credenziali non valide' });
            return;
        }
        // مقارنة كلمة السر بعد التشفير
        const passwordMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!passwordMatch) {
            res.status(401).json({ message: 'Credenziali non valide' });
            return;
        }
        // إنشاء التوكن مع بيانات بسيطة داخل payload
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore server interno', error: error.message });
    }
});
exports.login = login;
