// Import statements using ES6 modules
import express from 'express';
import cors from 'cors';
import { connection, initSession } from './connection/conn.js';
import dotenv from 'dotenv';
import route from './routes/Router.js';

// Initialize environment variables from .env file
dotenv.config();

const port = '9090';
const app = express();

// Enable CORS middleware
// Enable CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials (cookies)
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  }));
  
// Parse JSON requests
app.use(express.json());

// Initialize sessions (if that's what `initSession` does)
app.use(initSession);

// Use your routes
app.use(route);

// Connect to the database
connection();

app.listen(port, () => console.log(`Server started on ${port}`));
