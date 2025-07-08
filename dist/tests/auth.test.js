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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Assicurati che il percorso sia corretto secondo la struttura del tuo progetto
describe('Test login utente', () => {
    test('Login riuscito con credenziali valide', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            username: 'najmedinfelhiuser',
            password: 'najmedinfelhipass'
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    }));
    test('Login fallito con credenziali sbagliate', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            username: 'utenteinvalido',
            password: 'sbagliatissima'
        });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Credenziali non valide');
    }));
});
