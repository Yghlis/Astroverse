// server/routes/index.js

import express from 'express';
const router = express.Router();

// Define a default route for testing
router.get('/', (req, res) => {
  res.send('API is working');
});

export default router;
