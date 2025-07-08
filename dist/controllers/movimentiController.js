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
Object.defineProperty(exports, "__esModule", { value: true });
exports.movimentiPerPeriodo = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const movimentiPerPeriodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { semiLavoratoId, dal, al } = req.body;
    if (!semiLavoratoId || !dal || !al) {
        return void res.status(400).json({ error: "Parametri mancanti: semiLavoratoId, dal, al" });
    }
    try {
        const dalDate = new Date(dal);
        const alDate = new Date(al);
        // ⬇️ Operazioni di prelievo
        const prelievi = yield models_1.Prelievo.findAll({
            where: {
                semiLavoratoId,
                timestamp: {
                    [sequelize_1.Op.between]: [dalDate, alDate],
                },
            },
            attributes: ['id', 'quantitaPrelevata', 'timestamp'],
        });
        // ⬇️ Operazioni di carico
        const carichi = yield models_1.Carico.findAll({
            where: {
                semiLavoratoId,
                timestamp: {
                    [sequelize_1.Op.between]: [dalDate, alDate],
                },
            },
            attributes: ['id', 'quantita', 'timestamp'],
        });
        // ⬇️ Formattazione del risultato
        const movimenti = [
            ...prelievi.map(p => ({
                id: p.id,
                tipo: 'PRELIEVO',
                quantita: p.quantitaPrelevata,
                timestamp: p.timestamp,
            })),
            ...carichi.map(c => ({
                id: c.id,
                tipo: 'CARICO',
                quantita: c.quantita,
                timestamp: c.timestamp,
            }))
        ];
        // ⬇️ Ordinamento per data
        movimenti.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        res.json({
            semiLavoratoId,
            dal,
            al,
            movimenti
        });
    }
    catch (error) {
        console.error("❌ Errore nel recupero movimenti:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.movimentiPerPeriodo = movimentiPerPeriodo;
