import request from 'supertest';
import app from '../app'; // Assicurati che il percorso sia corretto secondo la struttura del tuo progetto

describe('Test login utente', () => {
  test('Login riuscito con credenziali valide', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'najmedinfelhiuser',
        password: 'najmedinfelhipass'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Login fallito con credenziali sbagliate', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'utenteinvalido',
        password: 'sbagliatissima'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Credenziali non valide');
  });
});
