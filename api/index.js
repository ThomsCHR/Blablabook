import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { apiRouter } from './routers/index.js';
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use((req, res, next) => { console.log('req.url :>> ', req.url); next()});

app.use('/api' ,apiRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
