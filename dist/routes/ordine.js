"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ordineController_1 = require("../controllers/ordineController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Rotta protetta per creare un nuovo ordine.
 * Verifica la validità degli elementi e richiede JWT.
 */
router.post('/', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.body)('items').isArray({ min: 1 }).withMessage('La lista degli elementi è obbligatoria e non può essere vuota'),
    (0, express_validator_1.body)('items.*.semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId deve essere un intero positivo'),
    (0, express_validator_1.body)('items.*.quantita').isInt({ gt: 0 }).withMessage('quantita deve essere un intero positivo'),
    validate_1.validateRequest
], ordineController_1.creaOrdine);
/**
 * Rotta pubblica per ottenere i dettagli di un ordine tramite ID.
 * Non richiede autenticazione.
 */
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    validate_1.validateRequest
], ordineController_1.getOrdineDettagliato);
/**
 * Rotta protetta per filtrare ordini in base a parametri opzionali.
 * Richiede JWT.
 */
router.post('/Filtrati', 
// verificaTokenJWT,
[
    (0, express_validator_1.body)('semiLavoratoId').optional().custom(value => {
        if (Array.isArray(value)) {
            if (!value.every((v) => Number.isInteger(v) && v > 0)) {
                throw new Error('semiLavoratoId deve essere un array di interi positivi');
            }
        }
        else if (typeof value === 'number') {
            if (value <= 0)
                throw new Error('semiLavoratoId deve essere un intero positivo');
        }
        return true;
    }),
    (0, express_validator_1.body)('dal').optional().isISO8601().withMessage('dal deve essere una data valida'),
    (0, express_validator_1.body)('al').optional().isISO8601().withMessage('al deve essere una data valida'),
    validate_1.validateRequest
], ordineController_1.getOrdiniFiltrati);
exports.default = router;
