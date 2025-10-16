import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { apiRouter } from './routers/index.js';
import path from "path";
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Sert à retrouver le chemin absolu du dossier courant
const clientDistPath = path.join(__dirname, "../client/myapp/dist"); // Chemin vers le dossier 'dist' de l'application front-end
const app = express(); // création de l'application express
const PORT = process.env.PORT || 3000;

app.use(cors()); // pour autoriser les requêtes cross-origin 

app.use(express.json()); // pour parser le corps des requêtes en JSON
app.use((req, res, next) => { console.log('req.url :>> ', req.url); next()}); // log des requêtes
app.use('/api' ,apiRouter); // pour toutes les routes commençant par /api, utiliser le routeur apiRouter

app.use(express.static(clientDistPath)); // sert les fichiers statiques (HTML, CSS, JS) du dossier 'dist' de l'application front-end

app.get(/^\/(?!api).*/, (req, res) => { 
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
