"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const semiLavoratoController_1 = require("../controllers/semiLavoratoController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Rotta pubblica per ottenere tutti i semi-lavorati.
 */
router.get('/', semiLavoratoController_1.getAll);
/**
 * Rotta protetta per creare un nuovo semi-lavorato.
 */
router.post('/', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.body)('nome').isString().notEmpty().withMessage('Nome è obbligatorio'),
    (0, express_validator_1.body)('quantitaDisponibile').isInt({ min: 0 }).withMessage('quantitaDisponibile deve essere intero >= 0'),
    validate_1.validateRequest
], semiLavoratoController_1.create);
/**
 * Rotta pubblica per ottenere un semi-lavorato tramite ID.
 */
router.get('/:id', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.param)('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    validate_1.validateRequest
], semiLavoratoController_1.getById);
/**
 * Rotta protetta per aggiornare un semi-lavorato tramite ID.
 */
router.put('/:id', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.param)('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    (0, express_validator_1.body)('nome').optional().isString().notEmpty(),
    (0, express_validator_1.body)('quantitaDisponibile').optional().isInt({ min: 0 }),
    validate_1.validateRequest
], semiLavoratoController_1.update);
/**
 * Rotta protetta per eliminare un semi-lavorato tramite ID.
 */
router.delete('/:id', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.param)('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    validate_1.validateRequest
], semiLavoratoController_1.remove);
/**
 * Rotta protetta per registrare un carico (aumento quantità) di un semi-lavorato.
 */
router.post('/carico', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.body)('semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId è obbligatorio e deve essere un intero positivo'),
    (0, express_validator_1.body)('quantita').isInt({ gt: 0 }).withMessage('quantita deve essere un intero positivo'),
    validate_1.validateRequest
], semiLavoratoController_1.registraCarico);
exports.default = router;
