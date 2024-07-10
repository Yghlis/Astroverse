import { Op } from 'sequelize';
import Universe from '../models/Universe.js';
import Product from '../models/Product.js';
import Character from '../models/Character.js';
import Follow from '../models/Follow.js';
import sequelize from '../config/database.js';


export const addUniverse = async (req, res) => {
  const { name, color1, color2, colorText } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const existingUniverse = await Universe.findOne({ where: { name } });
    if (existingUniverse) {
      await transaction.rollback();
      return res.sendStatus(409);
    }

    const universe = await Universe.create({
      name,
      color1,
      color2,
      colorText,
    }, { transaction });

    await transaction.commit();
    res.status(201).json(universe); 
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500);
  }
};

export const getUniverses = async (req, res) => {
  try {
    const universes = await Universe.findAll();
    res.status(200).json(universes); 
  } catch (error) {
    res.sendStatus(500); 
  }
};

export const getUniverseById = async (req, res) => {
  const { id } = req.params;

  try {
    const universe = await Universe.findByPk(id);
    if (!universe) {
      return res.sendStatus(404); 
    }
    res.status(200).json(universe);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateUniverse = async (req, res) => {
  const { id } = req.params;
  const { name, color1, color2, colorText } = req.body;
  console.log('Received data for update:', req.body);

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.findByPk(id);
    if (!universe) {
      console.log('Universe not found');
      return res.sendStatus(404); 
    }

    const existingUniverse = await Universe.findOne({ where: { name, id: { [Op.ne]: id } } });
    if (existingUniverse) {
      return res.sendStatus(409); 
    }

    console.log('Updating Universe with ID:', id);
    await universe.update({
      name,
      color1,
      color2,
      colorText,
    }, { transaction });

    await transaction.commit();
    console.log('Update committed successfully');
    res.status(200).json(universe); 
  } catch (error) {
    console.error("Error updating universe:", error);
    await transaction.rollback();
    res.sendStatus(500); 
  }
};

export const deleteUniverse = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.findByPk(id, { transaction });
    if (!universe) {
      await transaction.rollback();
      return res.sendStatus(404);
    }

    const productsCount = await Product.count({ where: { universe: id }, transaction });
    if (productsCount > 0) {
      await transaction.rollback();
      return res.sendStatus(400);
    }

    const charactersCount = await Character.count({ where: { universe: id }, transaction });
    if (charactersCount > 0) {
      await transaction.rollback();
      return res.sendStatus(400); 
    }

    await universe.destroy({ transaction });
    await transaction.commit();
    res.sendStatus(200); 
  } catch (error) {
    await transaction.rollback();
    res.sendStatus(500); 
  }
};


export const followUniverse = async (req, res) => {
  const { userId } = req.body; 
  const { universeId } = req.params;

  if (userId !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized to follow universe for another user' });
  }
  try {
    const universe = await Universe.findByPk(universeId);
    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    const existingFollow = await Follow.findOne({ where: { userId, universeId } });
    if (existingFollow) {
      return res.sendStatus(409);
    }
    await Follow.create({ userId, universeId });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(400);
  }
};

//Arrêter de suivre un univers
export const unfollowUniverse = async (req, res) => {
  const { userId } = req.body; // ID utilisateur fourni dans le body
  const { universeId } = req.params;

  if (userId !== req.user.userId) {
    return res.status(403).json({ error: 'Unauthorized to unfollow universe for another user' });
  }

  console.log(`User ID: ${userId}, Universe ID: ${universeId}`); // Log des IDs

  try {
    const follow = await Follow.destroy({ where: { userId, universeId } });
    if (follow) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};