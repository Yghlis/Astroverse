import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { indexRouter } from './routes/index.js';
import sequelize from './config/database.js';
import Product from './models/Product.js';
import Universe from './models/Universe.js';
import User from './models/user.js'; 
import Character from './models/Character.js';
import Follow from './models/Follow.js'; // Importez le modèle Follow
import Basket from './models/Basket.js'; 
import productRoutes from './routes/product.js';
import universeRoutes from './routes/universe.js';
import characterRoutes from './routes/character.js';
import userRoutes from './routes/user.js'; 
import favoriteRoutes from './routes/favorites.js'; 
import newsletterRoutes from './routes/newsletter.js';
import geocodeRoutes from './routes/geocode.js';
import basketRoutes from './routes/basket.js'; 
import orderRoutes from './routes/order.js';

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
app.use('/favorites', favoriteRoutes);
app.use('/newsletter', newsletterRoutes); 
app.use('/basket', basketRoutes); 
app.use('/orders', orderRoutes);


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

// Définir les associations après l'importation des modèles
User.hasMany(Follow, { foreignKey: 'userId' });
Follow.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Follow, { foreignKey: 'productId' });
Follow.belongsTo(Product, { foreignKey: 'productId' });

Universe.hasMany(Follow, { foreignKey: 'universeId' });
Follow.belongsTo(Universe, { foreignKey: 'universeId' });

Product.belongsToMany(Order, { through: 'OrderProduct' });
Order.belongsToMany(Product, { through: 'OrderProduct', as: 'products' });

// Connexion à PostgreSQL et synchronisation des modèles
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');

    return sequelize.sync({ alter: true }); // Synchroniser tous les modèles avec la base de données
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
