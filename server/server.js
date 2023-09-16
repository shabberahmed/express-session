// Import statements using ES6 modules
import express from 'express';
import cors from 'cors';
import { connection, initSession } from './connection/conn.js';
import dotenv from 'dotenv';
import route from './routes/Router.js';
dotenv.config();
const port = '9090';
const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  }));
  
app.use(express.json());

app.use(initSession);

app.use(route);
connection();

app.listen(port, () => console.log(`Server started on ${port}`));
