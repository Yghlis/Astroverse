const express = require('express');

const router = express.Router();

router.get('/login', (req,res,next) => {
    res.send('Login route');
});

module.exports = router;