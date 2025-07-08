# Dockerfile
FROM node:18

# Definire la directory di lavoro
WORKDIR /app

# Copiare i file delle dipendenze
COPY package*.json ./

# Installare le dipendenze
RUN npm install

# Copiare il resto dei file
COPY . .

# Compilare il TypeScript se necessario
RUN npm run build

# Esporre la porta
EXPOSE 3000

# Avviare l'applicazione
CMD ["npm", "start"]
