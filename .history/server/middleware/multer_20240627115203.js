// src/middleware/multer.js
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // Répertoire où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier unique
  }
});

// Configure multer
const upload = multer({ storage: storage });

module.exports = upload;
