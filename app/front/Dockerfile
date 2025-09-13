FROM node:18-alpine
WORKDIR /app

# Copiar package.json y package-lock.json para instalar deps
COPY package*.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Build del proyecto Next
RUN npm run build

EXPOSE 3000

# Ejecutar Next en modo producción
CMD ["npm", "start"]
