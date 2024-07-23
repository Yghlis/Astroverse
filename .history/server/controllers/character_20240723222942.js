import Character from '../models/Character.js';
import Universe from '../models/Universe.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize'; 
import { z } from 'zod';



export const addCharacter = async (req, res) => {
  const addCharacterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    universe: z.string().uuid("Universe ID must be a valid UUID"),
  })
  try {
    addCharacterSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: e.errors });
  }

  const { name, universe } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const universeRecord = await Universe.findOne({ where: { id: universe } });
    if (!universeRecord) {
      return res.status(404).json({ error: 'Universe not found' });
    }
    const existingCharacter = await Character.findOne({
      where: { name }
    });

    if (existingCharacter) {
      return res.status(409).json({ error: 'A character with the same name already exists' });
    }
    const character = await Character.create({
      name,
      universe: universeRecord.id
    }, { transaction });

    await transaction.commit();
    res.status(201).json(character);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateCharacter = async (req, res) => {
  const { id } = req.params;
  const updateCharacterSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    universe: z.string().uuid("Universe ID must be a valid UUID").optional(),
  })
  try {
    updateCharacterSchema.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: e.errors });
  }

  const { name, universe } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const character = await Character.findByPk(id);
    if (!character) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Character not found' });
    }

    if (universe) {
      const universeRecord = await Universe.findOne({ where: { id: universe } });
      if (!universeRecord) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Universe not found' });
      }
    }

    if (name) {
      const existingCharacter = await Character.findOne({
        where: {
          name,
          id: { [Op.ne]: id } 
        }
      });

      if (existingCharacter) {
        await transaction.rollback();
        return res.status(409).json({ error: 'A character with the same name already exists' });
      }
    }

    await character.update({
      name: name || character.name,
      universe: universe || character.universe
    }, { transaction });

    await transaction.commit();
    res.json(character);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};


export const getCharacters = async (req, res) => {
  try {
    const characters = await Character.findAll();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCharacterById = async (req, res) => {
  const { id } = req.params;

  try {
    const character = await Character.findByPk(id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();
  try {
    const character = await Character.findByPk(id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }


    const relatedProducts = await character.getProducts(); 
    if (relatedProducts.length > 0) {
      return res.status(400).json({ error: 'Cannot delete character with related products' });
    }

    await character.destroy({ transaction });

    await transaction.commit();
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
