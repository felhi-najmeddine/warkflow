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
const app_1 = __importDefault(require("../app"));
describe('Test rotta pubblica /api/ordini/Filtrati', () => {
    test('✅ Ritorna lista di ordini filtrati per data valida', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/ordini/Filtrati')
            .send({
            dal: '2024-01-01',
            al: '2025-01-01'
        });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // se ci sono dati, verifica che abbiano i campi attesi
        if (res.body.length > 0) {
            const ordine = res.body[0];
            expect(ordine).toHaveProperty('id');
            expect(ordine).toHaveProperty('stato');
            expect(ordine).toHaveProperty('semiLavorato');
            expect(ordine).toHaveProperty('quantitaRichiesta');
            expect(ordine).toHaveProperty('createdAt');
        }
    }));
    test('❌ Ritorna errore se data non valida', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/ordini/Filtrati')
            .send({
            dal: 'not-a-date'
        });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    }));
});
