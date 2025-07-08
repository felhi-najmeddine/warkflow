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
exports.eseguiPrelievo = void 0;
const models_1 = require("../models"); // Ordine contiene i dettagli
const eseguiPrelievo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ordineId, semiLavoratoId, quantitaPrelevata } = req.body;
    try {
        // Recupera l'ordine principale (inteso come ordine con dettagli)
        const ordine = yield models_1.Ordine.findByPk(ordineId);
        if (!ordine)
            return void res.status(404).json({ error: "Ordine non trovato" });
        // Controllo stato ordine
        if (!['CREATO', 'IN ESECUZIONE'].includes(ordine.stato)) {
            return void res.status(400).json({ error: `Ordine in stato ${ordine.stato}, non è possibile eseguire il prelievo` });
        }
        // Recupera il semi-lavorato
        const semi = yield models_1.SemiLavorato.findByPk(semiLavoratoId);
        if (!semi)
            return void res.status(404).json({ error: "Semi-lavorato non trovato" });
        if (semi.quantitaDisponibile < quantitaPrelevata) {
            return void res.status(400).json({ error: "Quantità disponibile insufficiente" });
        }
        // Recupera il dettaglio specifico dal modello Ordine (in cui ci sono dettagli)
        // Supponiamo che Ordine abbia i campi semiLavoratoId e quantitaRichiesta per ogni "dettaglio"
        // Se non è così, bisogna vedere come i dettagli sono rappresentati nel modello Ordine
        const dettaglio = yield models_1.Ordine.findOne({
            where: {
                id: ordineId,
                semiLavoratoId: semiLavoratoId,
            },
        });
        if (!dettaglio)
            return void res.status(404).json({ error: "Elemento ordine non trovato" });
        const quantitaRichiesta = dettaglio.quantitaRichiesta;
        // Calcola la quantità già prelevata
        const prelieviPrecedenti = yield models_1.Prelievo.findAll({
            where: { ordineId, semiLavoratoId }
        });
        const quantitaPrelevataTotale = prelieviPrecedenti.reduce((acc, p) => acc + p.quantitaPrelevata, 0);
        if (quantitaPrelevataTotale + quantitaPrelevata > quantitaRichiesta) {
            ordine.stato = 'FALLITO';
            yield ordine.save();
            return void res.status(400).json({ error: "Prelievo eccede quantità richiesta. Ordine segnato come FALLITO." });
        }
        // Aggiorna quantità disponibile
        semi.quantitaDisponibile -= quantitaPrelevata;
        yield semi.save();
        // Registra il prelievo
        yield models_1.Prelievo.create({
            ordineId,
            semiLavoratoId,
            quantitaPrelevata,
            timestamp: new Date()
        });
        // Aggiorna stato ordine se necessario
        if (ordine.stato === 'CREATO') {
            ordine.stato = 'IN ESECUZIONE';
            yield ordine.save();
        }
        // Controlla se tutti i dettagli ordine sono completati
        const dettagli = yield models_1.Ordine.findAll({ where: { id: ordineId } }); // recupera tutti i dettagli di questo ordine
        const tuttiCompletati = yield Promise.all(dettagli.map((d) => __awaiter(void 0, void 0, void 0, function* () {
            const prelievi = yield models_1.Prelievo.findAll({
                where: {
                    ordineId: d.id,
                    semiLavoratoId: d.semiLavoratoId
                }
            });
            const sommaPrelevata = prelievi.reduce((acc, p) => acc + p.quantitaPrelevata, 0);
            return sommaPrelevata >= d.quantitaRichiesta;
        })));
        if (tuttiCompletati.every(Boolean)) {
            ordine.stato = 'COMPLETATO';
            yield ordine.save();
            console.log(`✅ Ordine ${ordineId} COMPLETATO`);
        }
        res.json({ message: "Prelievo eseguito con successo" });
    }
    catch (error) {
        console.log("❌ Errore durante il prelievo:", error.message);
        next(error); // Passa l'errore al middleware centrale
    }
});
exports.eseguiPrelievo = eseguiPrelievo;
