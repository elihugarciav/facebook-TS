FROM node:20-bullseye

# Carpeta de trabajo en el contenedor
WORKDIR /app

# Instalar librerías necesarias
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    xvfb \
    x11-utils \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
    libpango-1.0-0 libpangocairo-1.0-0 libasound2 libgtk-3-0 libxss1 libgconf-2-4 \
    && rm -rf /var/lib/apt/lists/*


# Copiar package.json primero para aprovechar la cache de Docker
COPY package*.json tsconfig.json ./

# Instalar dependencias
RUN npm install

EXPOSE 3000
# Comando
CMD ["npm", "run", "dev"]
