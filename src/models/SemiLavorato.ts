import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SemiLavoratoAttributes {
  id: number;
  nome: string;
  quantitaDisponibile: number;
}

interface SemiLavoratoCreationAttributes extends Optional<SemiLavoratoAttributes, 'id'> {}

class SemiLavorato extends Model<SemiLavoratoAttributes, SemiLavoratoCreationAttributes> implements SemiLavoratoAttributes {
  public id!: number;
  public nome!: string;
  public quantitaDisponibile!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SemiLavorato.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  quantitaDisponibile: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
  sequelize,
  tableName: 'semi_lavorati',
  timestamps: true,
});

export default SemiLavorato;
