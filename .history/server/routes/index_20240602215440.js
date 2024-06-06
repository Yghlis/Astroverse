// server/routes/index.js

import express from 'express';
import mongoose from 'mongoose';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool();

// MongoDB route
router.get('/test/mongo', async (req, res) => {
  try {
    const testCollection = mongoose.connection.collection('testCollection');
    const documents = await testCollection.find({}).limit(10).toArray();
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PostgreSQL route
router.get('/test/postgres', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testTable LIMIT 10');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define a default route for testing
router.get('/', (req, res) => {
  res.send('API is working');
});

export default router;
