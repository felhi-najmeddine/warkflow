"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carico = exports.Prelievo = exports.Utente = exports.Ordine = exports.SemiLavorato = void 0;
const SemiLavorato_1 = __importDefault(require("./SemiLavorato"));
exports.SemiLavorato = SemiLavorato_1.default;
const Ordine_1 = __importDefault(require("./Ordine"));
exports.Ordine = Ordine_1.default;
const Prelievo_1 = __importDefault(require("./Prelievo"));
exports.Prelievo = Prelievo_1.default;
const Carico_1 = __importDefault(require("./Carico"));
exports.Carico = Carico_1.default;
const Utente_1 = __importDefault(require("./Utente"));
exports.Utente = Utente_1.default;
// Associations SemiLavorato - Ordine
SemiLavorato_1.default.hasMany(Ordine_1.default, { foreignKey: 'semiLavoratoId', as: 'ordini' });
Ordine_1.default.belongsTo(SemiLavorato_1.default, { foreignKey: 'semiLavoratoId', as: 'semiLavorato' });
// Associations Ordine - Prelievo
Ordine_1.default.hasMany(Prelievo_1.default, { foreignKey: 'ordineId', as: 'prelievi' });
Prelievo_1.default.belongsTo(Ordine_1.default, { foreignKey: 'ordineId', as: 'ordine' });
// Associations SemiLavorato - Prelievo
SemiLavorato_1.default.hasMany(Prelievo_1.default, { foreignKey: 'semiLavoratoId', as: 'prelievi' });
Prelievo_1.default.belongsTo(SemiLavorato_1.default, { foreignKey: 'semiLavoratoId', as: 'semiLavorato' });
// Associations SemiLavorato - Carico
SemiLavorato_1.default.hasMany(Carico_1.default, { foreignKey: 'semiLavoratoId', as: 'carichi' });
Carico_1.default.belongsTo(SemiLavorato_1.default, { foreignKey: 'semiLavoratoId', as: 'semiLavorato' });
