import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PrelievoAttributes {
  id: number;
  quantitaPrelevata: number;
  timestamp: Date;
  ordineId?: number;
  semiLavoratoId?: number;
}

interface PrelievoCreationAttributes extends Optional<PrelievoAttributes, 'id' | 'timestamp'> {}

class Prelievo extends Model<PrelievoAttributes, PrelievoCreationAttributes> implements PrelievoAttributes {
  public id!: number;
  public quantitaPrelevata!: number;
  public timestamp!: Date;

  public ordineId?: number;
  public semiLavoratoId?: number;
}

Prelievo.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantitaPrelevata: { type: DataTypes.INTEGER, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'prelievi',
  timestamps: false,
});

export default Prelievo;
