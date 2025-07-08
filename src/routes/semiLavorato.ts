import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAll,
  create,
  update,
  registraCarico,
  getById,
  remove
} from '../controllers/semiLavoratoController';
import { validateRequest } from '../middleware/validate';
import { verificaTokenJWT } from '../middleware/authMiddleware';

const router = Router();

/**
 * Rotta pubblica per ottenere tutti i semi-lavorati.
 */
router.get('/', getAll);

/**
 * Rotta protetta per creare un nuovo semi-lavorato.
 */
router.post(
  '/',
  verificaTokenJWT,
  [
    body('nome').isString().notEmpty().withMessage('Nome è obbligatorio'),
    body('quantitaDisponibile').isInt({ min: 0 }).withMessage('quantitaDisponibile deve essere intero >= 0'),
    validateRequest
  ],
  create
);

/**
 * Rotta pubblica per ottenere un semi-lavorato tramite ID.
 */
router.get(
  '/:id',
  verificaTokenJWT,
  [
    param('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    validateRequest
  ],
  getById
);

/**
 * Rotta protetta per aggiornare un semi-lavorato tramite ID.
 */
router.put(
  '/:id',
  verificaTokenJWT,
  [
    param('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    body('nome').optional().isString().notEmpty(),
    body('quantitaDisponibile').optional().isInt({ min: 0 }),
    validateRequest
  ],
  update
);

/**
 * Rotta protetta per eliminare un semi-lavorato tramite ID.
 */
router.delete(
  '/:id',
  verificaTokenJWT,
  [
    param('id').isInt({ gt: 0 }).withMessage('ID deve essere un intero positivo'),
    validateRequest
  ],
  remove
);

/**
 * Rotta protetta per registrare un carico (aumento quantità) di un semi-lavorato.
 */
router.post(
  '/carico',
  verificaTokenJWT,
  [
    body('semiLavoratoId').isInt({ gt: 0 }).withMessage('semiLavoratoId è obbligatorio e deve essere un intero positivo'),
    body('quantita').isInt({ gt: 0 }).withMessage('quantita deve essere un intero positivo'),
    validateRequest
  ],
  registraCarico
);

export default router;
