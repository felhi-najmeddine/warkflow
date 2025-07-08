// src/models/Utente.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UtenteAttributes {
  id: number;
  username: string;
  passwordHash: string;
}

interface UtenteCreationAttributes extends Optional<UtenteAttributes, 'id'> {}

class Utente extends Model<UtenteAttributes, UtenteCreationAttributes> implements UtenteAttributes {
  public id!: number;
  public username!: string;
  public passwordHash!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Utente.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'utenti',
  timestamps: true,
});

export default Utente;
