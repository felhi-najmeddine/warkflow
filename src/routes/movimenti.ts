import express from 'express';
import { body } from 'express-validator';
import { movimentiPerPeriodo } from '../controllers/movimentiController';
import { validateRequest } from '../middleware/validate';
import { verificaTokenJWT } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Rotta protetta per ottenere i movimenti di carico e prelievo
 * di un semi-lavorato in un intervallo di date.
 * Richiede un token JWT valido.
 */
router.post(
  '/',
  verificaTokenJWT, // Protegge la rotta con JWT
  [
    body('semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId obbligatorio e deve essere un intero positivo'),
    body('dal').isISO8601().withMessage('dal deve essere una data valida'),
    body('al').isISO8601().withMessage('al deve essere una data valida'),
    validateRequest
  ],
  movimentiPerPeriodo
);

export default router;
