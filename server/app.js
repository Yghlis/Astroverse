import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { indexRouter } from './routes/index.js';
import sequelize from './config/database.js';
import Product from './models/Product.js';
import Universe from './models/Universe.js';
import User from './models/user.js'; 
import Character from './models/Character.js';
import productRoutes from './routes/product.js';
import universeRoutes from './routes/universe.js';
import characterRoutes from './routes/character.js';
import userRoutes from './routes/user.js'; 
import geocodeRoutes from './routes/geocode.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
import authRoutes from './routes/auth.js';

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Routes
app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/universes', universeRoutes);
app.use('/characters', characterRoutes);
app.use('/users', userRoutes); 
app.use('/geocode', geocodeRoutes);
app.use('/uploads', express.static('uploads'));

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

    return Universe.sync({ alter: true })
      .then(() => Character.sync({ alter: true }))
      .then(() => Product.sync({ alter: true }))
      .then(() => User.sync({ alter: true }));
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
