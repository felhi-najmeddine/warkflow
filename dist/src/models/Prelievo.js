"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Prelievo extends sequelize_1.Model {
}
Prelievo.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantitaPrelevata: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    timestamp: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: database_1.default,
    tableName: 'prelievi',
    timestamps: false,
});
exports.default = Prelievo;
