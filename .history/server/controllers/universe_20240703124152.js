import { Op } from 'sequelize';
import Universe from '../models/Universe.js';
import Product from '../models/Product.js';
import Character from '../models/Character.js';
import sequelize from '../config/database.js';

export const addUniverse = async (req, res) => {
  const { name, color1, color2, colorText, link } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const existingUniverse = await Universe.findOne({ where: { name } });
    if (existingUniverse) {
      return res.status(409).json({ error: 'Un univers avec ce nom existe déjà. Veuillez choisir un autre nom.' });
    }
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
    const existingUniverse = await Universe.findOne({ where: { name, id: { [Op.ne]: id } } });
    if (existingUniverse) {
      return res.status(409).json({ error: 'Un univers avec ce nom existe déjà. Veuillez choisir un autre nom.' });
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

    const productsCount = await Product.count({ where: { universe: id }, transaction });
    if (productsCount > 0) {
      return res.status(400).json({ error: 'Cannot delete universe with associated products' });
    }

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
