import { Request, Response,NextFunction  } from 'express';
import { Ordine, Prelievo, SemiLavorato } from '../models'; // Ordine contiene i dettagli

export const eseguiPrelievo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { ordineId, semiLavoratoId, quantitaPrelevata } = req.body;

  try {
    // Recupera l'ordine principale (inteso come ordine con dettagli)
    const ordine = await Ordine.findByPk(ordineId);
    if (!ordine) return void res.status(404).json({ error: "Ordine non trovato" });

    // Controllo stato ordine
    if (!['CREATO', 'IN ESECUZIONE'].includes(ordine.stato)) {
      return void res.status(400).json({ error: `Ordine in stato ${ordine.stato}, non è possibile eseguire il prelievo` });
    }

    // Recupera il semi-lavorato
    const semi = await SemiLavorato.findByPk(semiLavoratoId);
    if (!semi) return void res.status(404).json({ error: "Semi-lavorato non trovato" });

    if (semi.quantitaDisponibile < quantitaPrelevata) {
      return void res.status(400).json({ error: "Quantità disponibile insufficiente" });
    }

    // Recupera il dettaglio specifico dal modello Ordine (in cui ci sono dettagli)
    // Supponiamo che Ordine abbia i campi semiLavoratoId e quantitaRichiesta per ogni "dettaglio"
    // Se non è così, bisogna vedere come i dettagli sono rappresentati nel modello Ordine
    const dettaglio = await Ordine.findOne({
      where: {
        id: ordineId,
        semiLavoratoId: semiLavoratoId,
      },
    });

    if (!dettaglio) return void res.status(404).json({ error: "Elemento ordine non trovato" });

    const quantitaRichiesta = dettaglio.quantitaRichiesta;

    // Calcola la quantità già prelevata
    const prelieviPrecedenti = await Prelievo.findAll({
      where: { ordineId, semiLavoratoId }
    });

    const quantitaPrelevataTotale = prelieviPrecedenti.reduce((acc, p) => acc + p.quantitaPrelevata, 0);

    if (quantitaPrelevataTotale + quantitaPrelevata > quantitaRichiesta) {
      ordine.stato = 'FALLITO';
      await ordine.save();
      return void res.status(400).json({ error: "Prelievo eccede quantità richiesta. Ordine segnato come FALLITO." });
    }

    // Aggiorna quantità disponibile
    semi.quantitaDisponibile -= quantitaPrelevata;
    await semi.save();

    // Registra il prelievo
    await Prelievo.create({
      ordineId,
      semiLavoratoId,
      quantitaPrelevata,
      timestamp: new Date()
    });

    // Aggiorna stato ordine se necessario
    if (ordine.stato === 'CREATO') {
      ordine.stato = 'IN ESECUZIONE';
      await ordine.save();
    }

    // Controlla se tutti i dettagli ordine sono completati
    const dettagli = await Ordine.findAll({ where: { id: ordineId } }); // recupera tutti i dettagli di questo ordine
    const tuttiCompletati = await Promise.all(
      dettagli.map(async d => {
        const prelievi = await Prelievo.findAll({
          where: {
            ordineId: d.id,
            semiLavoratoId: d.semiLavoratoId
          }
        });
        const sommaPrelevata = prelievi.reduce((acc, p) => acc + p.quantitaPrelevata, 0);
        return sommaPrelevata >= d.quantitaRichiesta;
      })
    );

    if (tuttiCompletati.every(Boolean)) {
      ordine.stato = 'COMPLETATO';
      await ordine.save();
      console.log(`✅ Ordine ${ordineId} COMPLETATO`);
    }

    res.json({ message: "Prelievo eseguito con successo" });

  } catch (error: any) {
    console.log("❌ Errore durante il prelievo:", error.message);
     next(error);  // Passa l'errore al middleware centrale
  }
};
