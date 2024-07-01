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
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
    });

    // Configurer multer
    const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB par fichier
    });

    export default upload;
