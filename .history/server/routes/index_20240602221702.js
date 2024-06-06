import express from 'express';
import mongoose from 'mongoose';
import sequelize from '../config/database.js';

const router = express.Router();

router.use('/auth', authRoutes);

// Route de test pour MongoDB
router.get('/test-mongo', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collections = await db.db.listCollections().toArray();
    res.status(200).json({ message: 'Connected to MongoDB', collections });
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to MongoDB', error: err });
  }
});

// Route de test pour PostgreSQL
router.get('/test-postgres', async (req, res) => {
  try {
    await sequelize.authenticate();
    const result = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    res.status(200).json({ message: 'Connected to PostgreSQL', tables: result[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to PostgreSQL', error: err });
  }
});

// Ajoutez d'autres routes ici si nécessaire

export { router as indexRouter };
