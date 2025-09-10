import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { apiRouter } from './routers/index.js';
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const clientDistPath = path.join(__dirname, "../client/myapp/dist");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use((req, res, next) => { console.log('req.url :>> ', req.url); next()});

app.use('/api' ,apiRouter);


app.use(express.static(clientDistPath));

// Serve only frontend routes (ignore /api)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
