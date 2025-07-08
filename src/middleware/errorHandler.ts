// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware per la gestione centralizzata degli errori.
 * Registra l'errore nel log e risponde con un messaggio appropriato.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || 'Errore interno del server';

  res.status(statusCode).json({ error: message });
}
