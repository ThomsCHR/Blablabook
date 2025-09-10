# ----------------------------
# Étape 1 : Builder le frontend (Svelte)
# ----------------------------
    FROM node:lts-alpine AS build-client

    # Définir le dossier de travail pour le frontend
    WORKDIR /client
    
    # Copier les fichiers package pour installer les dépendances
    COPY client/myapp/package*.json .
    
    # Installer les dépendances
    RUN npm install
    
    # Copier tout le frontend
    COPY client/myapp/ .
    
    # Définir la variable d'environnement pour la prod
    ARG VITE_BASE_URL
    ENV VITE_BASE_URL=$VITE_BASE_URL
    
    # Build du frontend
    RUN npm run build
    
    # ----------------------------
    # Étape 2 : Installer le backend (API)
    # ----------------------------
    FROM node:20 AS build-api
    
    WORKDIR /app
    
    # Copier package.json + package-lock.json
    COPY api/package*.json ./
    
    # Installer les dépendances du backend
    RUN npm install --production
    
    # Copier tout le code de l'API
    COPY api/ .
    
    # ----------------------------
    # Étape 3 : Image finale (API + frontend buildé)
    # ----------------------------
    FROM node:20
    
    WORKDIR /app
    
    # Copier le build du frontend
    COPY --from=build-client /client/build ./client/dist

    
    # Copier le backend
    COPY --from=build-api /app .
    
    # Variables d'environnement pour le backend
    ENV NODE_ENV=production
    ENV PORT=8080
    
    # Exposer le port
    EXPOSE 8080
    
    # Lancer le backend
    CMD ["npm", "start"]
    