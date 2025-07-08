import { Router } from 'express';
import { body, param } from 'express-validator';
import { creaOrdine, getOrdineDettagliato, getOrdiniFiltrati } from '../controllers/ordineController';
import { validateRequest } from '../middleware/validate';
import { verificaTokenJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * Rotta protetta per creare un nuovo ordine.
 * Verifica la validità degli elementi e richiede JWT.
 */
router.post(
  '/',
  verificaTokenJWT,
  [
    body('items').isArray({ min: 1 }).withMessage('La lista degli elementi è obbligatoria e non può essere vuota'),
    body('items.*.semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId deve essere un intero positivo'),
    body('items.*.quantita').isInt({ gt: 0 }).withMessage('quantita deve essere un intero positivo'),
    validateRequest
  ],
  creaOrdine
);

/**
 * Rotta pubblica per ottenere i dettagli di un ordine tramite ID.
 * Non richiede autenticazione.
 */
router.get(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    validateRequest
  ],
  getOrdineDettagliato
);

/**
 * Rotta protetta per filtrare ordini in base a parametri opzionali.
 * Richiede JWT.
 */
router.post(
  '/Filtrati',
  // verificaTokenJWT,
  [
    body('semiLavoratoId').optional().custom(value => {
      if (Array.isArray(value)) {
        if (!value.every((v) => Number.isInteger(v) && v > 0)) {
          throw new Error('semiLavoratoId deve essere un array di interi positivi');
        }
      } else if (typeof value === 'number') {
        if (value <= 0) throw new Error('semiLavoratoId deve essere un intero positivo');
      }
      return true;
    }),
    body('dal').optional().isISO8601().withMessage('dal deve essere una data valida'),
    body('al').optional().isISO8601().withMessage('al deve essere una data valida'),
    validateRequest
  ],
  getOrdiniFiltrati
);

export default router;
