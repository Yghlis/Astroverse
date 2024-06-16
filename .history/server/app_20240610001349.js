import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { indexRouter } from './routes/index.js'; // Assurez-vous que le chemin est correct
import sequelize from './config/database.js';




dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation du routeur
app.use('/', indexRouter);

app.use('/auth', authRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Connexion à MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Connexion à PostgreSQL
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
