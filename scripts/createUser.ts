// scripts/createUser.ts
import bcrypt from 'bcrypt';
import Utente from '../src/models/Utente';
import sequelize from '../src/config/database';

async function createUser(username: string, password: string) {
  try {
    // Connessione al database
    await sequelize.authenticate();
    console.log('Connessione al DB riuscita');

    // Verifica se l'utente esiste già
    const existingUser = await Utente.findOne({ where: { username } });
    if (existingUser) {
      console.log('Utente già esistente');
      return;
    }

    // Crittografia della password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Creazione del nuovo utente
    const newUser = await Utente.create({
      username,
      passwordHash
    });

    console.log(`Utente creato con ID: ${newUser.id}`);
  } catch (error) {
    // Gestione degli errori
    console.error('Errore:', error);
  } finally {
    // Chiusura della connessione al DB
    await sequelize.close();
  }
}

// Recupera i parametri da riga di comando
const username = process.argv[2];
const password = process.argv[3];

// Controlla che username e password siano forniti
if (!username || !password) {
  console.log('Uso: ts-node scripts/createUser.ts <username> <password>');
  process.exit(1);
}

// Esegue la funzione per creare l'utente
createUser(username, password);
