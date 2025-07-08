import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

type StatoOrdine = 'CREATO' | 'FALLITO' | 'IN ESECUZIONE' | 'COMPLETATO';

interface OrdineAttributes {
  id: number;
  stato: StatoOrdine;
  semiLavoratoId: number;
  quantitaRichiesta: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrdineCreationAttributes extends Optional<OrdineAttributes, 'id'> {}

class Ordine extends Model<OrdineAttributes, OrdineCreationAttributes> implements OrdineAttributes {
  public id!: number;
  public stato!: StatoOrdine;
  public semiLavoratoId!: number;
  public quantitaRichiesta!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ordine.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  stato: {
    type: DataTypes.ENUM('CREATO', 'FALLITO', 'IN ESECUZIONE', 'COMPLETATO'),
    allowNull: false,
    defaultValue: 'CREATO',
  },
  semiLavoratoId: { type: DataTypes.INTEGER, allowNull: false },
  quantitaRichiesta: { type: DataTypes.INTEGER, allowNull: false },
}, {
  sequelize,
  tableName: 'ordini',
  timestamps: true,
});

export default Ordine;
