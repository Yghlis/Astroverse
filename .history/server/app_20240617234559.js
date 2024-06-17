import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { indexRouter } from './routes/index.js'; // Assurez-vous que le chemin est correct
import sequelize from './config/database.js';
import Product from './models/Product.js'; // Importer le modèle Product
import productRoutes from './routes/product.js'; // Importer les routes des produits

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
import authRoutes from './routes/auth.js';

// Middleware
app.use(cors());x 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation du routeur
app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/products', productRoutes); // Ajouter le routeur des produits

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

// Connexion à PostgreSQL et synchronisation des modèles
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    // Synchronisation des modèles avec la base de données
    return Product.sync({ alter: true }); // Utiliser alter pour mettre à jour la structure sans perdre les données existantes
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to PostgreSQL:', err);
  });

export default app;
