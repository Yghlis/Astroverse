import express from 'express';

const router = express.Router();

// Exemple de route
router.get('/', (req, res) => {
  res.send('User route');
});

export default router;
