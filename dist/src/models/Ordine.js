"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Ordine extends sequelize_1.Model {
}
Ordine.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stato: {
        type: sequelize_1.DataTypes.ENUM('CREATO', 'FALLITO', 'IN ESECUZIONE', 'COMPLETATO'),
        allowNull: false,
        defaultValue: 'CREATO',
    },
    semiLavoratoId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    quantitaRichiesta: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: database_1.default,
    tableName: 'ordini',
    timestamps: true,
});
exports.default = Ordine;
