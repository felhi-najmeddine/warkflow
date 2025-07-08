"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
/**
 * Route per login, restituisce un token JWT valido
 */
router.post('/login', [
    (0, express_validator_1.body)('username').isString().notEmpty().withMessage('Username è obbligatorio'),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage('Password è obbligatoria'),
    validate_1.validateRequest
], authController_1.login);
exports.default = router;
