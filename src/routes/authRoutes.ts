// src/routes/auth.ts
import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

/**
 * Route per login, restituisce un token JWT valido
 */
router.post(
  '/login',
  [
    body('username').isString().notEmpty().withMessage('Username è obbligatorio'),
    body('password').isString().notEmpty().withMessage('Password è obbligatoria'),
    validateRequest
  ],
  login
);

export default router;
