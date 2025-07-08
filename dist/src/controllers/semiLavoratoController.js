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
exports.registraCarico = exports.getById = exports.remove = exports.update = exports.create = exports.getAll = void 0;
const models_1 = require("../models");
// Recupera tutti i semi-lavorati
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const semi = yield models_1.SemiLavorato.findAll();
        console.log("Lista semi-lavorati recuperata con successo");
        res.json(semi);
    }
    catch (error) {
        console.log("Errore nel recupero dei semi-lavorati:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.getAll = getAll;
// Crea un nuovo semi-lavorato
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, quantitaDisponibile } = req.body;
        const nuovoSemi = yield models_1.SemiLavorato.create({ nome, quantitaDisponibile });
        console.log("Semi-lavorato creato con successo:", nome);
        res.status(201).json(nuovoSemi);
    }
    catch (error) {
        console.log("Errore nella creazione del semi-lavorato:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.create = create;
// Aggiorna un semi-lavorato
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { nome, quantitaDisponibile } = req.body;
        const semi = yield models_1.SemiLavorato.findByPk(id);
        if (!semi) {
            res.status(404).json({ error: "Semi-lavorato non trovato" });
            return;
        }
        semi.nome = nome !== null && nome !== void 0 ? nome : semi.nome;
        semi.quantitaDisponibile = quantitaDisponibile !== null && quantitaDisponibile !== void 0 ? quantitaDisponibile : semi.quantitaDisponibile;
        yield semi.save();
        console.log("Semi-lavorato aggiornato con successo:", id);
        res.json(semi);
    }
    catch (error) {
        console.log("Errore nell'aggiornamento del semi-lavorato:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.update = update;
// Elimina un semi-lavorato
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const semi = yield models_1.SemiLavorato.findByPk(id);
        if (!semi) {
            res.status(404).json({ error: "Semi-lavorato non trovato" });
            return;
        }
        yield semi.destroy();
        console.log("Semi-lavorato eliminato con successo:", id);
        res.json({ message: "Semi-lavorato eliminato" });
    }
    catch (error) {
        console.log("Errore nella cancellazione del semi-lavorato:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.remove = remove;
// Recupera un singolo semi-lavorato per ID
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const semi = yield models_1.SemiLavorato.findByPk(id);
        if (!semi) {
            res.status(404).json({ error: "Semi-lavorato non trovato" });
            return;
        }
        console.log("Semi-lavorato trovato con successo:", id);
        res.json(semi);
    }
    catch (error) {
        console.log("Errore nel recupero del semi-lavorato:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.getById = getById;
const registraCarico = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { semiLavoratoId, quantita } = req.body;
        console.log(req.body);
        const quantitaNum = Number(quantita);
        if (!semiLavoratoId || !quantita || isNaN(quantitaNum) || quantitaNum <= 0) {
            res.status(400).json({ error: 'Dati mancanti o quantità non valida' });
            return;
        }
        const semi = yield models_1.SemiLavorato.findByPk(semiLavoratoId);
        if (!semi) {
            res.status(404).json({ error: 'Semi-lavorato non trovato' });
            return;
        }
        semi.quantitaDisponibile += quantitaNum;
        yield semi.save();
        const carico = yield models_1.Carico.create({ semiLavoratoId, quantita: quantitaNum });
        console.log("✅ Carico registrato con successo", carico.id);
        res.status(201).json({ message: 'Carico registrato', carico });
    }
    catch (error) {
        console.error('❌ Errore durante il carico:', error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.registraCarico = registraCarico;
