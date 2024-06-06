const path = require('path');

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { indexRouter } from './routes/index.js';  // Utilisez les accolades pour l'importation nommée
import sequelize from './config/database.js';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import cors from 'cors';

dotenv.config();

const MongoDBStore = connectMongoDBSession(session);

const app = express();

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'sessions'
});

const port = process.env.PORT || 8000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use('/', indexRouter);  // Utilisez indexRouter normalement

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to PostgreSQL:', err);
  });

export default app;
