import Character from '../models/Character.js';
import CharacterMongo from '../models/CharacterMongo.js';
import Universe from '../models/Universe.js';
import sequelize from '../config/database.js';

export const addCharacter = async (req, res) => {
  const { name, universe } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    const character = await Character.create({
      name,
      universe: universeRecord.id
    }, { transaction });

    const characterMongo = new CharacterMongo({
      id: character.id,
      name,
      universe: {
        id: universeRecord.id,
        name: universeRecord.name
      },
      created_at: character.created_at,
      updated_at: character.updated_at
    });

    await characterMongo.save();
    await transaction.commit();
    res.status(201).json(character);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les personnages
export const getCharacters = async (req, res) => {
  try {
    const characters = await CharacterMongo.find({});
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCharacter = async (req, res) => {
  const { id } = req.params;
  const { name, universe } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const character = await Character.findByPk(id);
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const universeRecord = await Universe.findOne({ where: { name: universe } });
    if (!universeRecord) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    await character.update({
      name,
      universe: universeRecord.id
    }, { transaction });

    const characterMongo = await CharacterMongo.findOne({ id });
    if (characterMongo) {
      await characterMongo.updateOne({
        name,
        universe: {
          id: universeRecord.id,
          name: universeRecord.name
        },
        updated_at: new Date()
      });
    }

    await transaction.commit();
    res.json(character);
  } catch (error) {
    await transaction.rollback();
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

    await character.destroy({ transaction });
    await CharacterMongo.deleteOne({ id });

    await transaction.commit();
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
