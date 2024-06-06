import express from 'express';
import mongoose from 'mongoose';
import sequelize from '../config/database.js';
import authRoutes from './auth.js'; 

const router = express.Router();

router.use('/auth', authRoutes);

// Route de test pour MongoDB
router.get('/test-mongo', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('test-collection');
    const documents = await collection.find({}).toArray();
    res.status(200).json({ message: 'Connected to MongoDB', documents });
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to MongoDB', error: err });
  }
});

// Route de test pour PostgreSQL
router.get('/test-postgres', async (req, res) => {
  try {
    await sequelize.authenticate();
    const [results, metadata] = await sequelize.query("SELECT * FROM \"Users\"");
    res.status(200).json({ message: 'Connected to PostgreSQL', users: results });
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to PostgreSQL', error: err });
  }
});

// Ajoutez d'autres routes ici si nécessaire

export { router as indexRouter };
