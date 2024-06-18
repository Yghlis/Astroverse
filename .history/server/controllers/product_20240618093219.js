import Product from '../models/Product.js';
import ProductMongo from '../models/ProductMongo.js';
import Universe from '../models/Universe.js';
import sequelize from '../config/database.js';

export const addProduct = async (req, res) => {
  const {
    title,
    brand,
    price,
    discounted_price,
    is_promotion,
    description,
    stock,
    number_of_purchases,
    number_of_favorites,
    rating,
    image_preview,
    image_gallery,
    character,
    universe, 
    reference,
    details,
    tags,
    availability_status,
    views_count
  } = req.body;

  const transaction = await sequelize.transaction();
  try {
    console.log('Recherche de l\'univers par nom:', universe);
    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      console.error('Univers non trouvé:', universe);
    //   return res.status(404).json({ error: 'L' });
    }

    console.log('Création du produit');
    const product = await Product.create({
      title,
      brand,
      price,
      discounted_price,
      is_promotion,
      description,
      stock,
      number_of_purchases,
      number_of_favorites,
      rating,
      image_preview,
      image_gallery,
      character,
      universe: universeRecord.id, // Utilisation de l'ID de l'univers
      reference,
      details,
      tags,
      availability_status,
      views_count
    }, { transaction });

    console.log('Création du produit dans MongoDB');
    const productMongo = new ProductMongo({
      id: product.id,
      title,
      brand,
      price,
      discounted_price,
      is_promotion,
      description,
      stock,
      number_of_purchases,
      number_of_favorites,
      rating,
      image_preview,
      image_gallery,
      character,
      universe: {
        id: universeRecord.id,
        name: universeRecord.name
      },
      reference,
      details,
      tags,
      availability_status,
      views_count,
      created_at: product.created_at,
      updated_at: product.updated_at
    });

    await productMongo.save();

    await transaction.commit();
    console.log('Produit créé avec succès:', product.id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les produits
export const getProducts = async (req, res) => {
  try {
    const products = await ProductMongo.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    brand,
    price,
    discounted_price,
    is_promotion,
    description,
    stock,
    number_of_purchases,
    number_of_favorites,
    rating,
    image_preview,
    image_gallery,
    character,
    universe, // Nom de l'univers
    reference,
    details,
    tags,
    availability_status,
    views_count
  } = req.body;

  const transaction = await sequelize.transaction();
  try {
    console.log('Recherche du produit par ID:', id);
    const product = await Product.findByPk(id);
    if (!product) {
      console.error('Produit non trouvé:', id);
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Recherche de l\'univers par nom:', universe);
    // Vérification de l'existence de l'univers par son nom
    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      console.error('Univers non trouvé:', universe);
      return res.status(404).json({ error: 'Universe not found' });
    }

    console.log('Mise à jour du produit');
    await product.update({
      title,
      brand,
      price,
      discounted_price,
      is_promotion,
      description,
      stock,
      number_of_purchases,
      number_of_favorites,
      rating,
      image_preview,
      image_gallery,
      character,
      universe: universeRecord.id, // Utilisation de l'ID de l'univers
      reference,
      details,
      tags,
      availability_status,
      views_count
    }, { transaction });

    console.log('Mise à jour du produit dans MongoDB');
    const productMongo = await ProductMongo.findOne({ id });
    if (productMongo) {
      await productMongo.updateOne({
        title,
        brand,
        price,
        discounted_price,
        is_promotion,
        description,
        stock,
        number_of_purchases,
        number_of_favorites,
        rating,
        image_preview,
        image_gallery,
        character,
        universe: {
          id: universeRecord.id,
          name: universeRecord.name
        },
        reference,
        details,
        tags,
        availability_status,
        views_count,
        updated_at: new Date()
      });
    }

    await transaction.commit();
    console.log('Produit mis à jour avec succès:', id);
    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un produit
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    console.log('Recherche du produit par ID pour suppression:', id);
    const product = await Product.findByPk(id);
    if (!product) {
      console.error('Produit non trouvé:', id);
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Suppression du produit');
    await product.destroy({ transaction });
    await ProductMongo.deleteOne({ id });

    await transaction.commit();
    console.log('Produit supprimé avec succès:', id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
