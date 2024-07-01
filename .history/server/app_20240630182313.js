import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { indexRouter } from './routes/index.js';
import sequelize from './config/database.js';
import Universe from './models/Universe.js';
import Character from './models/Character.js'; // Order matters here
import Product from './models/Product.js'; 
import User from './models/user.js';
import productRoutes from './routes/product.js';
import universeRoutes from './routes/universe.js';
import characterRoutes from './routes/character.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
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
app.use('/uploads', express.static('uploads'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Connect to PostgreSQL and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return sequelize.sync({ alter: true });
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
