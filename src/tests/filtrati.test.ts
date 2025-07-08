import request from 'supertest';
import app from '../app';

describe('Test rotta pubblica /api/ordini/Filtrati', () => {

  test('✅ Ritorna lista di ordini filtrati per data valida', async () => {
    const res = await request(app)
      .post('/api/ordini/Filtrati')
      .send({
        dal: '2024-01-01',
        al: '2025-01-01'
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // se ci sono dati, verifica che abbiano i campi attesi
    if (res.body.length > 0) {
      const ordine = res.body[0];
      expect(ordine).toHaveProperty('id');
      expect(ordine).toHaveProperty('stato');
      expect(ordine).toHaveProperty('semiLavorato');
      expect(ordine).toHaveProperty('quantitaRichiesta');
      expect(ordine).toHaveProperty('createdAt');
    }
  });

  test('❌ Ritorna errore se data non valida', async () => {
    const res = await request(app)
      .post('/api/ordini/Filtrati')
      .send({
        dal: 'not-a-date'
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

});
