import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CaricoAttributes {
  id: number;
  semiLavoratoId: number;
  quantita: number;
  timestamp: Date;
}

interface CaricoCreationAttributes extends Optional<CaricoAttributes, 'id' | 'timestamp'> {}

class Carico extends Model<CaricoAttributes, CaricoCreationAttributes> implements CaricoAttributes {
  public id!: number;
  public semiLavoratoId!: number;
  public quantita!: number;
  public timestamp!: Date;
}

Carico.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  semiLavoratoId: { type: DataTypes.INTEGER, allowNull: false },
  quantita: { type: DataTypes.INTEGER, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  sequelize,
  tableName: 'carichi',
  timestamps: false,
});

export default Carico;
