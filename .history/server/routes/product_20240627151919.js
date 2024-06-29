import express from 'express';
import { addProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Route pour ajouter un produit avec upload d'images
router.post('/', upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), addProduct);

// Route pour récupérer tous les produits
router.get('/', getProducts);

// Route pour récupérer un produit par ID
router.get('/:id', getProductById);

// Route pour mettre à jour un produit avec upload d'images
router.put('/:id', upload.fields([{ name: 'image_preview', maxCount: 1 }, { name: 'image_gallery', maxCount: 4 }]), async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    // Gestion des fichiers téléchargés
    if (req.files) {
      if (req.files.image_preview) {
        const imagePreviewUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.image_preview[0].filename}`;
        updatedData.image_preview = imagePreviewUrl;
      }
      if (req.files.image_gallery) {
        const imageGalleryUrls = req.files.image_gallery.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
        updatedData.image_gallery = imageGalleryUrls;
      }
    }

    // Appel de la fonction updateProduct avec les données mises à jour
    const updatedProduct = await updateProduct(productId, updatedData);

    if (!updatedProduct) {
      return res.status(404).send('Product not found.');
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).send('Server error.');
  }
});

// Route pour supprimer un produit
router.delete('/:id', deleteProduct);

export default router;





/*// server/routes/product.js
import express from 'express';
import { addProduct, updateProduct, deleteProduct, getProducts } from '../controllers/product.js';

const router = express.Router();

// Route pour ajouter un produit
router.post('/add', addProduct);

// Route pour mettre à jour un produit
router.put('/update/:id', updateProduct);

// Route pour supprimer un produit
router.delete('/delete/:id', deleteProduct);

// Route pour obtenir tous les produits
router.get('/', getProducts);

export default router; */