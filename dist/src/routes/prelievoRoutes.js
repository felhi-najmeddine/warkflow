"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prelievoController_1 = require("../controllers/prelievoController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Rotta protetta per eseguire un prelievo di un semi-lavorato
 * da un ordine specifico. Richiede JWT.
 */
router.post('/esegui', authMiddleware_1.verificaTokenJWT, [
    (0, express_validator_1.body)('ordineId').isInt({ gt: 0 }).withMessage('ordineId deve essere un intero positivo'),
    (0, express_validator_1.body)('semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId deve essere un intero positivo'),
    (0, express_validator_1.body)('quantitaPrelevata').isInt({ gt: 0 }).withMessage('quantitaPrelevata deve essere un intero positivo'),
    validate_1.validateRequest
], prelievoController_1.eseguiPrelievo);
exports.default = router;
