"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const movimentiController_1 = require("../controllers/movimentiController");
const validate_1 = require("../middleware/validate");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
/**
 * Rotta protetta per ottenere i movimenti di carico e prelievo
 * di un semi-lavorato in un intervallo di date.
 * Richiede un token JWT valido.
 */
router.post('/', authMiddleware_1.verificaTokenJWT, // Protegge la rotta con JWT
[
    (0, express_validator_1.body)('semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId obbligatorio e deve essere un intero positivo'),
    (0, express_validator_1.body)('dal').isISO8601().withMessage('dal deve essere una data valida'),
    (0, express_validator_1.body)('al').isISO8601().withMessage('al deve essere una data valida'),
    validate_1.validateRequest
], movimentiController_1.movimentiPerPeriodo);
exports.default = router;
