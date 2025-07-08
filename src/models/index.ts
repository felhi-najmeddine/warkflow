import SemiLavorato from './SemiLavorato';
import Ordine from './Ordine';
import Prelievo from './Prelievo';
import Carico from './Carico';
import Utente from './Utente';

// Associations SemiLavorato - Ordine
SemiLavorato.hasMany(Ordine, { foreignKey: 'semiLavoratoId', as: 'ordini' });
Ordine.belongsTo(SemiLavorato, { foreignKey: 'semiLavoratoId', as: 'semiLavorato' });

// Associations Ordine - Prelievo
Ordine.hasMany(Prelievo, { foreignKey: 'ordineId', as: 'prelievi' });
Prelievo.belongsTo(Ordine, { foreignKey: 'ordineId', as: 'ordine' });

// Associations SemiLavorato - Prelievo
SemiLavorato.hasMany(Prelievo, { foreignKey: 'semiLavoratoId', as: 'prelievi' });
Prelievo.belongsTo(SemiLavorato, { foreignKey: 'semiLavoratoId', as: 'semiLavorato' });

// Associations SemiLavorato - Carico
SemiLavorato.hasMany(Carico, { foreignKey: 'semiLavoratoId', as: 'carichi' });
Carico.belongsTo(SemiLavorato, { foreignKey: 'semiLavoratoId', as: 'semiLavorato' });

export {
  SemiLavorato,
  Ordine,
  Utente,
  Prelievo,
  Carico,
};
