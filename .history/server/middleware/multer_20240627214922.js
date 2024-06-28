import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crée le répertoire si nécessaire
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Répertoire où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier unique
  }
});

// Configure multer
const upload = multer({ storage: storage });

export default upload;
