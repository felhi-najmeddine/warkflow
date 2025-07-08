import { Request, Response,NextFunction  } from 'express';
import { Ordine, Prelievo, SemiLavorato, Carico } from '../models';

// Recupera tutti i semi-lavorati
export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const semi = await SemiLavorato.findAll();
    console.log("Lista semi-lavorati recuperata con successo");
    res.json(semi);
  } catch (error: any) {
    console.log("Errore nel recupero dei semi-lavorati:", error.message);
    next(error);  // Passa l'errore al middleware centrale
  }
};

// Crea un nuovo semi-lavorato
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome, quantitaDisponibile } = req.body;
    const nuovoSemi = await SemiLavorato.create({ nome, quantitaDisponibile });
    console.log("Semi-lavorato creato con successo:", nome);
    res.status(201).json(nuovoSemi);
  } catch (error: any) {
    console.log("Errore nella creazione del semi-lavorato:", error.message);
   next(error);  // Passa l'errore al middleware centrale
  }
};

// Aggiorna un semi-lavorato
export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const { nome, quantitaDisponibile } = req.body;
    const semi = await SemiLavorato.findByPk(id);
    if (!semi) {
      res.status(404).json({ error: "Semi-lavorato non trovato" });
      return;
    }
    semi.nome = nome ?? semi.nome;
    semi.quantitaDisponibile = quantitaDisponibile ?? semi.quantitaDisponibile;
    await semi.save();
    console.log("Semi-lavorato aggiornato con successo:", id);
    res.json(semi);
  } catch (error: any) {
    console.log("Errore nell'aggiornamento del semi-lavorato:", error.message);
    next(error);  // Passa l'errore al middleware centrale
  }
};

// Elimina un semi-lavorato
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const semi = await SemiLavorato.findByPk(id);
    if (!semi) {
      res.status(404).json({ error: "Semi-lavorato non trovato" });
      return;
    }
    await semi.destroy();
    console.log("Semi-lavorato eliminato con successo:", id);
    res.json({ message: "Semi-lavorato eliminato" });
  } catch (error: any) {
    console.log("Errore nella cancellazione del semi-lavorato:", error.message);
    next(error);  // Passa l'errore al middleware centrale
  }
};


// Recupera un singolo semi-lavorato per ID
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const semi = await SemiLavorato.findByPk(id);
    if (!semi) {
      res.status(404).json({ error: "Semi-lavorato non trovato" });
      return;
    }
    console.log("Semi-lavorato trovato con successo:", id);
    res.json(semi);
  } catch (error: any) {
    console.log("Errore nel recupero del semi-lavorato:", error.message);
    next(error);  // Passa l'errore al middleware centrale
  }
};

export const registraCarico = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { semiLavoratoId, quantita } = req.body;
    console.log(req.body);

    const quantitaNum = Number(quantita);

    if (!semiLavoratoId || !quantita || isNaN(quantitaNum) || quantitaNum <= 0) {
      res.status(400).json({ error: 'Dati mancanti o quantità non valida' });
      return;
    }

    const semi = await SemiLavorato.findByPk(semiLavoratoId);
    if (!semi) {
      res.status(404).json({ error: 'Semi-lavorato non trovato' });
      return;
    }

    semi.quantitaDisponibile += quantitaNum;
    await semi.save();

    const carico = await Carico.create({ semiLavoratoId, quantita: quantitaNum });
    console.log("✅ Carico registrato con successo", carico.id);

    res.status(201).json({ message: 'Carico registrato', carico });
  } catch (error: any) {
    console.error('❌ Errore durante il carico:', error.message);
      next(error);  // Passa l'errore al middleware centrale
  }
};
