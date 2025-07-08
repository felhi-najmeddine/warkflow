import { Router } from 'express';
import { body } from 'express-validator';
import { eseguiPrelievo } from '../controllers/prelievoController';
import { validateRequest } from '../middleware/validate';
import { verificaTokenJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * Rotta protetta per eseguire un prelievo di un semi-lavorato
 * da un ordine specifico. Richiede JWT.
 */
router.post(
  '/esegui',
  verificaTokenJWT,
  [
    body('ordineId').isInt({ gt: 0 }).withMessage('ordineId deve essere un intero positivo'),
    body('semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId deve essere un intero positivo'),
    body('quantitaPrelevata').isInt({ gt: 0 }).withMessage('quantitaPrelevata deve essere un intero positivo'),
    validateRequest
  ],
  eseguiPrelievo
);

export default router;
