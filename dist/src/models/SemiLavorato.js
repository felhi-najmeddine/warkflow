"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class SemiLavorato extends sequelize_1.Model {
}
SemiLavorato.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    quantitaDisponibile: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
    sequelize: database_1.default,
    tableName: 'semi_lavorati',
    timestamps: true,
});
exports.default = SemiLavorato;
