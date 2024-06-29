import Universe from '../models/Universe.js';
import Product from '../models/Product.js'; // Importer le modèle Product
import Character from '../models/Character.js'; // Importer le modèle Character
import sequelize from '../config/database.js';

export const addUniverse = async (req, res) => {
  const { name, color1, color2, colorText, link } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.create({
      name,
      color1,
      color2,
      colorText,
      link
    }, { transaction });

    await transaction.commit();
    res.status(201).json(universe);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const getUniverses = async (req, res) => {
  try {
    const universes = await Universe.findAll();
    res.json(universes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUniverseById = async (req, res) => {
  const { id } = req.params;

  try {
    const universe = await Universe.findByPk(id);
    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }
    res.json(universe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUniverse = async (req, res) => {
  const { id } = req.params;
  const { name, color1, color2, colorText, link } = req.body;
  console.log('Received data for update:', req.body); 

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.findByPk(id);
    if (!universe) {
      console.log('Universe not found');
      return res.status(404).json({ error: 'Universe not found' });
    }

    console.log('Updating Universe with ID:', id);
    await universe.update({
      name,
      color1,
      color2,
      colorText,
      link
    }, { transaction });

    await transaction.commit();
    console.log('Update committed successfully');
    res.json(universe);
  } catch (error) {
    console.error("Error updating universe:", error);
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const deleteUniverse = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.findByPk(id);
    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    // Vérifier s'il y a des produits associés à cet univers
    const productsCount = await Product.count({ where: { universe: id }, transaction });
    if (productsCount > 0) {
      return res.status(400).json({ error: 'Cannot delete universe with associated products' });
    }

    // Vérifier s'il y a des personnages associés à cet univers
    const charactersCount = await Character.count({ where: { universe: id }, transaction });
    if (charactersCount > 0) {
      return res.status(400).json({ error: 'Cannot delete universe with associated characters' });
    }

    await universe.destroy({ transaction });

    await transaction.commit();
    res.json({ message: 'Universe deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
