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
exports.getOrdiniFiltrati = exports.getOrdineDettagliato = exports.creaOrdine = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
// ➕ Crea un nuovo ordine di prelievo
const creaOrdine = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: "Lista elementi mancante o vuota" });
        return;
    }
    try {
        const nonDisponibili = [];
        for (const item of items) {
            const semi = yield models_1.SemiLavorato.findByPk(item.semiLavoratoId);
            if (!semi || semi.quantitaDisponibile < item.quantita) {
                nonDisponibili.push(item.semiLavoratoId);
            }
        }
        if (nonDisponibili.length > 0) {
            for (const id of nonDisponibili) {
                yield models_1.Ordine.create({
                    stato: 'FALLITO',
                    semiLavoratoId: id,
                    quantitaRichiesta: 0
                });
            }
            return void res.status(400).json({
                message: "Ordine fallito: quantità non disponibili",
                nonDisponibili,
            });
        }
        const ordiniCreati = [];
        for (const item of items) {
            const ordine = yield models_1.Ordine.create({
                stato: 'CREATO',
                semiLavoratoId: item.semiLavoratoId,
                quantitaRichiesta: item.quantita,
            });
            ordiniCreati.push(ordine.id);
        }
        res.status(201).json({ message: "Ordini creati", ordiniCreati });
    }
    catch (error) {
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.creaOrdine = creaOrdine;
// 🎯 Restituisce dettagli e stato ordine
const getOrdineDettagliato = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ordineId = parseInt(req.params.id, 10);
    try {
        const ordine = yield models_1.Ordine.findByPk(ordineId, {
            include: [{ model: models_1.SemiLavorato, as: 'semiLavorato' }]
        });
        if (!ordine) {
            return void res.status(404).json({ error: 'Ordine non trovato' });
        }
        const prelievi = yield models_1.Prelievo.findAll({
            where: { ordineId },
            order: [['timestamp', 'ASC']]
        });
        let durataCompletamento = null;
        if (ordine.stato === 'COMPLETATO' && prelievi.length >= 2) {
            const primo = prelievi[0].timestamp;
            const ultimo = prelievi[prelievi.length - 1].timestamp;
            const durataMs = new Date(ultimo).getTime() - new Date(primo).getTime();
            const seconds = Math.floor(durataMs / 1000) % 60;
            const minutes = Math.floor(durataMs / (1000 * 60)) % 60;
            const hours = Math.floor(durataMs / (1000 * 60 * 60));
            durataCompletamento = `${hours}h ${minutes}m ${seconds}s`;
        }
        const quantitaPrelevata = prelievi.reduce((acc, p) => acc + p.quantitaPrelevata, 0);
        res.json({
            ordineId: ordine.id,
            stato: ordine.stato,
            semiLavoratoId: ordine.semiLavoratoId,
            quantitaRichiesta: ordine.quantitaRichiesta,
            quantitaPrelevata,
            durata: durataCompletamento,
            prelievi: prelievi.map(p => ({
                semiLavoratoId: p.semiLavoratoId,
                quantita: p.quantitaPrelevata,
                timestamp: p.timestamp
            }))
        });
    }
    catch (error) {
        console.error("❌ Errore nel recupero ordine:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.getOrdineDettagliato = getOrdineDettagliato;
const getOrdiniFiltrati = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { semiLavoratoId, dal, al } = req.body;
    try {
        const where = {};
        if (dal && al) {
            where.createdAt = { [sequelize_1.Op.between]: [new Date(dal), new Date(al)] };
        }
        else if (dal) {
            where.createdAt = { [sequelize_1.Op.gte]: new Date(dal) };
        }
        else if (al) {
            where.createdAt = { [sequelize_1.Op.lte]: new Date(al) };
        }
        if (semiLavoratoId) {
            if (Array.isArray(semiLavoratoId)) {
                where.semiLavoratoId = { [sequelize_1.Op.in]: semiLavoratoId };
            }
            else {
                where.semiLavoratoId = semiLavoratoId;
            }
        }
        const ordini = yield models_1.Ordine.findAll({
            where,
            include: [
                {
                    model: models_1.SemiLavorato,
                    as: 'semiLavorato',
                    attributes: ['nome'],
                }
            ],
            order: [['id', 'ASC']],
        });
        const risultato = ordini.map(o => {
            var _a;
            const ordine = o; // ✅ bypass type check
            return {
                id: o.id,
                stato: o.stato,
                semiLavorato: ((_a = ordine.semiLavorato) === null || _a === void 0 ? void 0 : _a.nome) || 'N/A',
                quantitaRichiesta: o.quantitaRichiesta,
                createdAt: o.createdAt,
                updatedAt: o.updatedAt,
            };
        });
        res.json(risultato);
    }
    catch (error) {
        console.error("❌ Errore nel recupero ordini:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.getOrdiniFiltrati = getOrdiniFiltrati;
