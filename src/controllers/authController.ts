// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Utente from '../models/Utente';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const JWT_EXPIRATION = '1h'; // durata del token

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username e password sono obbligatori' });
    return;
  }

  try {
    const user = await Utente.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Credenziali non valide' });
      return;
    }

    // confronto della password cifrata
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Credenziali non valide' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ token });

  } catch (error: any) {
    res.status(500).json({ message: 'Errore interno del server', error: error.message });
  }
};
