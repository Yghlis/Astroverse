import { Op } from 'sequelize';
import Universe from '../models/Universe.js';
import Product from '../models/Product.js';
import Character from '../models/Character.js';
import Follow from '../models/Follow.js';
import sequelize from '../config/database.js';
import { z } from 'zod';

export const addUniverse = async (req, res) => {
  const { name, color1, color2, colorText } = req.body;
  const addUniverseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    color1: z.string().optional(),
    color2: z.string().optional(),
    colorText: z.string().optional(),
  });
  try {
    addUniverseSchema.parse(req.body);

    const transaction = await sequelize.transaction();
    try {
      const existingUniverse = await Universe.findOne({ where: { name }, transaction });
      if (existingUniverse) {
        await transaction.rollback();
        return res.status(409).json();
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
  } catch (error) {
    return res.status(400).json();
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
  try {
    const updateUniverseSchema = z.object({
      name: z.string().min(1, "Name is required").optional(),
      color1: z.string().optional(),
      color2: z.string().optional(),
      colorText: z.string().optional(),
    });
    // Validate input
    updateUniverseSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: e.errors });
  }

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.findByPk(id, { transaction });
    if (!universe) {
      console.log('Universe not found');
      await transaction.rollback();
      return res.sendStatus(404);
    }

    const existingUniverse = await Universe.findOne({
      where: { name, id: { [Op.ne]: id } },
      transaction
    });
    if (existingUniverse) {
      await transaction.rollback();
      return res.sendStatus(409);
    }

    console.log('Updating Universe with ID:', id);
    await universe.update({
      name: name !== undefined ? name : universe.name,
      color1: color1 !== undefined ? color1 : universe.color1,
      color2: color2 !== undefined ? color2 : universe.color2,
      colorText: colorText !== undefined ? colorText : universe.colorText,
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
  const followUniverseSchema = z.object({
    userId: z.string().uuid(),
  });

  const { universeId } = req.params;

  try {
    followUniverseSchema.parse(req.body);
    const { userId } = req.body;

    console.log(`Received follow request for user ${userId} and universe ${universeId}`);
    console.log('Request user ID from token:', req.user.userId);
    console.log('Full req.user object:', req.user);
    console.log('Full req.body object:', req.body);

    if (userId !== req.user.userId) {
      console.log('Unauthorized attempt to follow universe for another user');
      return res.status(403).json({ error: 'Unauthorized to follow universe for another user' });
    }

    const transaction = await sequelize.transaction();

    try {
      const universe = await Universe.findByPk(universeId, { transaction });
      if (!universe) {
        await transaction.rollback();
        console.log('Universe not found');
        return res.status(404).json({ error: 'Universe not found' });
      }

      const existingFollow = await Follow.findOne({ where: { userId, universeId }, transaction });
      if (existingFollow) {
        await transaction.rollback();
        console.log('Follow already exists');
        return res.status(409).json({ error: 'Already following this universe' });
      }

      await Follow.create({ userId, universeId }, { transaction });
      await transaction.commit();
      console.log('Follow created successfully');
      res.sendStatus(201);
    } catch (error) {
      await transaction.rollback();
      console.error('Error following universe:', error);
      res.status(500).json({ error: 'Failed to follow universe' });
    }
  } catch (error) {
    console.error('Error in request validation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to follow universe' });
  }
};

export const unfollowUniverse = async (req, res) => {
  const unfollowUniverseSchema = z.object({
    userId: z.string().uuid(),
  });

  const { universeId } = req.params;

  try {
    unfollowUniverseSchema.parse(req.body);
    const { userId } = req.body;

    if (userId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to unfollow universe for another user' });
    }

    const transaction = await sequelize.transaction();

    try {
      const follow = await Follow.destroy({ where: { userId, universeId }, transaction });
      if (follow) {
        await transaction.commit();
        res.sendStatus(200);
      } else {
        await transaction.rollback();
        res.sendStatus(404);
      }
    } catch (error) {
      await transaction.rollback();
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.sendStatus(400);
    }
  } catch (error) {
    console.error('Error in request validation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.sendStatus(500);
  }
};