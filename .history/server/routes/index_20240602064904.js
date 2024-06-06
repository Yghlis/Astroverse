// server/routes/index.js

const express = require('express');
const router = express.Router();

// Define a default route for testing
router.get('/', (req, res) => {
  res.send('API is working');
});

module.exports = router;
