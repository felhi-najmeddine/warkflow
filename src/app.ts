// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import semiLavoratoRoutes from './routes/semiLavorato';
import ordineRoutes from './routes/ordine';
import prelievoRoutes from './routes/prelievoRoutes';
import movimentiRoutes from './routes/movimenti';
import authRouter from './routes/authRoutes';

// Importazione del middleware per la gestione degli errori
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/semi-lavorati', semiLavoratoRoutes);
app.use('/api/ordini', ordineRoutes);
app.use('/api/prelievi', prelievoRoutes);
app.use('/api/movimenti', movimentiRoutes);

// Rotta base per verifica funzionamento server
app.get('/', (_req, res) => {
  res.send('✅ Server avviato correttamente');
});

// Middleware per la gestione centralizzata degli errori
app.use(errorHandler);

export default app;
