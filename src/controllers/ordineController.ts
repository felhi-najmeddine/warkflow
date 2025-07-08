import { Request, Response,NextFunction  } from 'express';
import { Op } from 'sequelize';

import { Ordine,  Prelievo, SemiLavorato } from '../models';

interface Item {
  semiLavoratoId: number;
  quantita: number;
}

// ➕ Crea un nuovo ordine di prelievo
export const creaOrdine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { items } = req.body as { items: Item[] };

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Lista elementi mancante o vuota" });
    return;
  }

  try {
    const nonDisponibili: number[] = [];

    for (const item of items) {
      const semi = await SemiLavorato.findByPk(item.semiLavoratoId);
      if (!semi || semi.quantitaDisponibile < item.quantita) {
        nonDisponibili.push(item.semiLavoratoId);
      }
    }

    if (nonDisponibili.length > 0) {
      for (const id of nonDisponibili) {
        await Ordine.create({
          stato: 'FALLITO',
          semiLavoratoId: id,
          quantitaRichiesta: 0
        });
      }
      return void res.status(400).json({
        message: "Ordine fallito: quantità non disponibili",
        nonDisponibili,
      });
    }

    const ordiniCreati = [];

    for (const item of items) {
      const ordine = await Ordine.create({
        stato: 'CREATO',
        semiLavoratoId: item.semiLavoratoId,
        quantitaRichiesta: item.quantita,
      });
      ordiniCreati.push(ordine.id);
    }

    res.status(201).json({ message: "Ordini creati", ordiniCreati });
  } catch (error: any) {
    next(error);  // Passa l'errore al middleware centrale
  }
};


// 🎯 Restituisce dettagli e stato ordine
export const getOrdineDettagliato = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const ordineId = parseInt(req.params.id, 10);

  try {
    const ordine = await Ordine.findByPk(ordineId, {
      include: [{ model: SemiLavorato, as: 'semiLavorato' }]
    });

    if (!ordine) {
      return void res.status(404).json({ error: 'Ordine non trovato' });
    }

    const prelievi = await Prelievo.findAll({
      where: { ordineId },
      order: [['timestamp', 'ASC']]
    });

    let durataCompletamento: string | null = null;
    if (ordine.stato === 'COMPLETATO' && prelievi.length >= 2) {
      const primo = prelievi[0].timestamp;
      const ultimo = prelievi[prelievi.length - 1].timestamp;
      const durataMs = new Date(ultimo).getTime() - new Date(primo).getTime();

      const seconds = Math.floor(durataMs / 1000) % 60;
      const minutes = Math.floor(durataMs / (1000 * 60)) % 60;
      const hours = Math.floor(durataMs / (1000 * 60 * 60));

      durataCompletamento = `${hours}h ${minutes}m ${seconds}s`;
    }

    const quantitaPrelevata = prelievi.reduce((acc, p) => acc + p.quantitaPrelevata, 0);

    res.json({
      ordineId: ordine.id,
      stato: ordine.stato,
      semiLavoratoId: ordine.semiLavoratoId,
      quantitaRichiesta: ordine.quantitaRichiesta,
      quantitaPrelevata,
      durata: durataCompletamento,
      prelievi: prelievi.map(p => ({
        semiLavoratoId: p.semiLavoratoId,
        quantita: p.quantitaPrelevata,
        timestamp: p.timestamp
      }))
    });

  } catch (error: any) {
    console.error("❌ Errore nel recupero ordine:", error.message);
    next(error);  // Passa l'errore al middleware centrale
  }
};



export const getOrdiniFiltrati = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { semiLavoratoId, dal, al } = req.body;

  try {
    const where: any = {};

    if (dal && al) {
      where.createdAt = { [Op.between]: [new Date(dal), new Date(al)] };
    } else if (dal) {
      where.createdAt = { [Op.gte]: new Date(dal) };
    } else if (al) {
      where.createdAt = { [Op.lte]: new Date(al) };
    }

    if (semiLavoratoId) {
      if (Array.isArray(semiLavoratoId)) {
        where.semiLavoratoId = { [Op.in]: semiLavoratoId };
      } else {
        where.semiLavoratoId = semiLavoratoId;
      }
    }

    const ordini = await Ordine.findAll({
      where,
      include: [
        {
          model: SemiLavorato,
          as: 'semiLavorato',
          attributes: ['nome'],
        }
      ],
      order: [['id', 'ASC']],
    });

    const risultato = ordini.map(o => {
      const ordine = o as any; // ✅ bypass type check

      return {
        id: o.id,
        stato: o.stato,
        semiLavorato: ordine.semiLavorato?.nome || 'N/A',
        quantitaRichiesta: o.quantitaRichiesta,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      };
    });

    res.json(risultato);

  } catch (error: any) {
    console.error("❌ Errore nel recupero ordini:", error.message);
     next(error);  // Passa l'errore al middleware centrale
  }
};

