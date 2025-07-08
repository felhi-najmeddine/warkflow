import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Prelievo, Carico, SemiLavorato } from '../models';

export const movimentiPerPeriodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { semiLavoratoId, dal, al } = req.body;

  if (!semiLavoratoId || !dal || !al) {
    return void res.status(400).json({ error: "Parametri mancanti: semiLavoratoId, dal, al" });
  }

  try {
    const dalDate = new Date(dal);
    const alDate = new Date(al);

    // ⬇️ Operazioni di prelievo
    const prelievi = await Prelievo.findAll({
      where: {
        semiLavoratoId,
        timestamp: {
          [Op.between]: [dalDate, alDate],
        },
      },
      attributes: ['id', 'quantitaPrelevata', 'timestamp'],
    });

    // ⬇️ Operazioni di carico
    const carichi = await Carico.findAll({
      where: {
        semiLavoratoId,
        timestamp: {
          [Op.between]: [dalDate, alDate],
        },
      },
      attributes: ['id', 'quantita', 'timestamp'],
    });

    // ⬇️ Formattazione del risultato
    const movimenti = [
      ...prelievi.map(p => ({
        id: p.id,
        tipo: 'PRELIEVO',
        quantita: p.quantitaPrelevata,
        timestamp: p.timestamp,
      })),
      ...carichi.map(c => ({
        id: c.id,
        tipo: 'CARICO',
        quantita: c.quantita,
        timestamp: c.timestamp,
      }))
    ];

    // ⬇️ Ordinamento per data
    movimenti.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.json({
      semiLavoratoId,
      dal,
      al,
      movimenti
    });

  } catch (error: any) {
    console.error("❌ Errore nel recupero movimenti:", error.message);
    next(error);  // Passa l'errore al middleware centrale
  }
};
