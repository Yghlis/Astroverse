import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { indexRouter } from './routes/index.js';
import sequelize from './config/database.js';
import Product from './models/Product.js';
import Universe from './models/Universe.js';
import User from './models/User.js';  
import Character from './models/Character.js';
import productRoutes from './routes/product.js';
import universeRoutes from './routes/universe.js';
import characterRoutes from './routes/character.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
import authRoutes from './routes/auth.js';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/universes', universeRoutes);
app.use('/characters', characterRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });


sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
  
    return Universe.sync({ alter: true }) 
      .then(() => Character.sync({ alter: true })) 
      .then(() => Product.sync({ alter: true })); 
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
