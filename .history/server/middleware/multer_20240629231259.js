import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le répertoire si nécessaire
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurer le stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const productId = req.productId || 'unknown'; // Utilisez l'id extrait par le middleware
    let suffix = '';
    if (file.fieldname === 'image_gallery') {
      const index = req.files['image_gallery'].indexOf(file);
      suffix = `_gallery_${index + 1}`;
    }
    const filename = `${productId}${suffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// Configurer multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB par fichier
});

export default upload;
