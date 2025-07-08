"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
/**
 * Middleware per la gestione centralizzata degli errori.
 * Registra l'errore nel log e risponde con un messaggio appropriato.
 */
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const message = err.message || 'Errore interno del server';
    res.status(statusCode).json({ error: message });
}
