# 🚀 Sistema di Gestione Workflow Semi-Lavorati

## 🎯 Obiettivo del progetto

Realizzare un sistema back-end per la gestione di un workflow di prelievo di semi-lavorati destinati alla produzione di un prodotto. Il sistema permette di creare, modificare e aggiornare i semi-lavorati, gestire ordini di prelievo con stati e validazioni sulla sequenza delle operazioni, e monitorare i movimenti di carico e prelievo.

## 🛠️ Tecnologie utilizzate

- **Node.js** con **TypeScript**
- **Express** (framework web)
- **Sequelize** (ORM per DB relazionale)
- **Database**: MySQL
- **JWT** per autenticazione
- **Jest** per testing
- **Docker & Docker Compose** per containerizzazione 

---
## 👤 Creazione manuale di un utente

Per creare un utente manualmente da terminale, puoi eseguire il seguente script:

docker compose exec backend npm run create-user -- nejmedinUser nejmedinPass

---

## 🔐 Login con Postman e Uso del Token JWT

### 📌 Endpoint di Login

```
POST http://localhost:3000/api/auth/login
```

### 📤 Corpo della Richiesta (Body)

Imposta il tipo di contenuto su **raw** e seleziona **JSON**, poi inserisci:

```json
{
  "username": "nejmedinUser",
  "password": "nejmedinPass"
}
```

### ✅ Risposta Attesa

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> ℹ️ **Nota**: Salva il token ricevuto per utilizzarlo come autorizzazione nei prossimi endpoint protetti (es. inserendolo nei **Headers** come `Authorization: Bearer <token>`).

---
## 🧪 Test dei Percorsi Protetti con Postman

Per testare un endpoint protetto da JWT usando Postman, segui questi passi:

1. Apri Postman.

2. Seleziona il metodo HTTP corretto (ad esempio **POST**) e inserisci l'URL dell'endpoint protetto, ad esempio `/api/ordini`.

3. Vai alla scheda **Headers** e aggiungi una nuova chiave:

   - **Key:** `Authorization`
   - **Value:** `Bearer <token>`

   Sostituisci `<token>` con il token JWT ottenuto dal login o dalla generazione token.

   Esempio:Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
4. Vai alla scheda **Body** e inserisci i dati necessari per la richiesta (solitamente in formato JSON).

5. Invia la richiesta e verifica la risposta.
   
---
## 📡 Descrizione API - Endpoints principali

### 📦 Semi-Lavorati

| ⚙️ Metodo | 🌐 Endpoint                    | 📘 Descrizione IT                       | 📥 Input                                                     | 📤 Output                                                   |
| -------- | --------------------------- | -------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| GET      | `/api/semi-lavorati`        | Recupera tutti i semilavorati          | Nessun input                                              | Lista di semilavorati con id, nome, quantità disponibile |
| POST     | `/api/semi-lavorati`        | Crea un nuovo semilavorato             | `{ "nome": "Nome prodotto", "quantitaDisponibile": 100 }` | Semilavorato creato con id                               |
| GET      | `/api/semi-lavorati/:id`    | Recupera un semilavorato per ID        | ID nel percorso                                           | Dettagli del semilavorato                                |
| PUT      | `/api/semi-lavorati/:id`    | Aggiorna un semilavorato               | `{ "nome": "Nome nuovo", "quantitaDisponibile": 200 }`    | Semilavorato aggiornato                                  |
| DELETE   | `/api/semi-lavorati/:id`    | Elimina un semilavorato                | ID nel percorso                                           | Messaggio di conferma                                    |
| POST     | `/api/semi-lavorati/carico` | Registra un carico (ricezione merce)   | `{ "semiLavoratoId": 1, "quantita": 50 }`                 | Messaggio e dati del carico registrato                   |

### 📋 Ordini

| ⚙️ Metodo | 🌐 Endpoint               | 📘 Descrizione IT                                   | 📥 Input                                                                                         | 📤 Output                                                                       |
| -------- | ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| POST     | `/api/ordini`          | Crea un nuovo ordine di prelievo                 | `{ "items": [{"semiLavoratoId": 1, "quantita": 20}, {"semiLavoratoId": 2, "quantita": 10}] }` | Lista ID ordini creati                                                       |
| GET      | `/api/ordini/:id`      | Recupera dettagli di un ordine                   | ID nel percorso                                                                               | Dettagli ordine, quantità richieste e prelevate, durata, prelievi effettuati |
| POST     | `/api/ordini/filtrati` | Filtra ordini per materiale e intervallo di date | `{ "semiLavoratoId": 1, "dal": "2025-01-01", "al": "2025-12-31" }`                            | Lista ordini filtrati                                                        |

### 🏗️ Prelievi

| ⚙️ Metodo | 🌐 Endpoint               | 📘 Descrizione IT                        | 📥 Input                                                            | 📤 Output                         |
| -------- | ---------------------- | ------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| POST     | `/api/prelievi/esegui` | Esegui prelievo quantità da magazzino | `{ "ordineId": 5, "semiLavoratoId": 1, "quantitaPrelevata": 5 }` | Messaggio di successo o errore |

### 🔁 Movimenti

| ⚙️ Metodo | 🌐 Endpoint         | 📘 Descrizione IT                                                           | 📥 Input                                                              | 📤 Output                      |
| -------- | ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------- |
| POST     | `/api/movimenti` | Visualizza movimenti di carico e prelievo per materiale in un intervallo | `{ "semiLavoratoId": 1, "dal": "2025-01-01", "al": "2025-12-31" }` | Lista dettagliata movimenti |

---

## Esempi di Input/Output

### GET /api/semi-lavorati

```json
{}
```

Output:

```json
[
  { "id": 1, "nome": "Motore", "quantitaDisponibile": 50 },
  { "id": 2, "nome": "Piastra metallica", "quantitaDisponibile": 120 }
]
```

### POST /api/semi-lavorati

```json
{
  "nome": "Cavo elettrico",
  "quantitaDisponibile": 200
}
```

Output:

```json
{
  "id": 3,
  "nome": "Cavo elettrico",
  "quantitaDisponibile": 200
}
```

### GET /api/semi-lavorati/\:id

Output:

```json
{
  "id": 1,
  "nome": "Motore",
  "quantitaDisponibile": 50
}
```

### PUT /api/semi-lavorati/\:id

```json
{
  "nome": "Motore aggiornato",
  "quantitaDisponibile": 80
}
```

Output:

```json
{
  "id": 1,
  "nome": "Motore aggiornato",
  "quantitaDisponibile": 80
}
```

### DELETE /api/semi-lavorati/\:id

Output:

```json
{
  "message": "Semilavorato eliminato con successo."
}
```

### POST /api/semi-lavorati/carico

```json
{
  "semiLavoratoId": 1,
  "quantita": 50
}
```

Output:

```json
{
  "message": "Carico registrato.",
  "semiLavorato": {
    "id": 1,
    "nome": "Motore",
    "quantitaDisponibile": 100
  }
}
```

### POST /api/ordini

```json
{
  "items": [
    { "semiLavoratoId": 1, "quantita": 10 },
    { "semiLavoratoId": 2, "quantita": 5 }
  ]
}
```

Output:

```json
{
  "ordineId": 7,
  "stato": "CREATO",
  "items": [
    { "semiLavoratoId": 1, "quantitaRichiesta": 10 },
    { "semiLavoratoId": 2, "quantitaRichiesta": 5 }
  ]
}
```

### GET /api/ordini/\:id

Output:

```json
{
  "ordineId": 7,
  "stato": "COMPLETATO",
  "durataSecondi": 120,
  "items": [
    { "semiLavoratoId": 1, "quantitaRichiesta": 10, "quantitaPrelevata": 10 },
    { "semiLavoratoId": 2, "quantitaRichiesta": 5, "quantitaPrelevata": 5 }
  ],
  "prelieviEffettuati": [
    { "semiLavoratoId": 1, "quantita": 10, "timestamp": "2025-07-07T14:12:00Z" },
    { "semiLavoratoId": 2, "quantita": 5, "timestamp": "2025-07-07T14:14:00Z" }
  ]
}
```

### POST /api/ordini/filtrati

```json
{
  "semiLavoratoId": 1,
  "dal": "2025-01-01",
  "al": "2025-12-31"
}
```

Output:

```json
[
  {
    "ordineId": 5,
    "stato": "COMPLETATO",
    "dataCreazione": "2025-05-01"
  },
  {
    "ordineId": 6,
    "stato": "IN ESECUZIONE",
    "dataCreazione": "2025-06-10"
  }
]
```

### POST /api/prelievi/esegui

```json
{
  "ordineId": 5,
  "semiLavoratoId": 1,
  "quantitaPrelevata": 5
}
```

Output:

```json
{
  "message": "Prelievo registrato.",
  "statoOrdine": "IN ESECUZIONE"
}
```

### POST /api/movimenti

```json
{
  "semiLavoratoId": 1,
  "dal": "2025-01-01",
  "al": "2025-12-31"
}
```

Output:

```json
[
  {
    "tipo": "carico",
    "quantita": 100,
    "data": "2025-03-01T09:00:00Z"
  },
  {
    "tipo": "prelievo",
    "quantita": 20,
    "data": "2025-03-05T14:30:00Z"
  }
]
```

---

## Architettura e Pattern di Design

- **MVC**: Separazione tra controller, servizi e modelli.
- **State Machine**: Gestione degli stati dell’ordine (CREATO, FALLITO, IN ESECUZIONE, COMPLETATO) con validazione sequenziale.
- **Middleware Express**: Validazione input, gestione autenticazione JWT e gestione errori centralizzata.
- **Repository Pattern** (opzionale): Per accesso ai dati tramite Sequelize.
- **Dependency Injection**: Nei servizi per testabilità e modularità.

---

## Autenticazione

- Tutte le rotte contrassegnate con [U] sono protette e richiedono token JWT valido.
- La chiave segreta JWT è caricata da `.env`.
- Middleware di autenticazione controlla la validità del token.


---

Questo metodo permette di verificare che il sistema autentichi correttamente le richieste protette e risponda solo se il token è valido.

## Come avviare il progetto

1. Clonare il repository:

```bash
git clone https://github.com/felhi-najmeddine/warkflow
cd warkflow
```

2. Creare il file `.env` con le variabili di ambiente necessarie

3. Avviare il sistema con Docker:

```bash
docker compose up --build
```

---

## Testing

- I test sono implementati con Jest
- Per eseguire:

```bash
npm run test
```

---

## Documentazione allegata

- Diagrammi UML
- Descrizione dei pattern usati
- Postman collection con esempi richieste/risposte

---

## Consegna

- Il progetto deve essere caricato su GitHub (repo pubblico)
- Indicare nel Moodle:
  - URL del repository
  - Commit ID

---

*Docente: Prof. Adriano Mancini – A.A. 2024/2025*
