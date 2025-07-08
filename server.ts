import sequelize from './config/database';
import app from './app';
import './models';

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) 
  .then(() => {
    console.log('✅ Tabelle create con successo');
    app.listen(PORT, () => {
      console.log(`🚀 Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Errore nella creazione delle tabelle:', err);
  });
