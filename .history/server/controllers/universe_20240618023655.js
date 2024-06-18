import Universe from '../models/Universe.js';
import UniverseMongo from '../models/UniverseMongo.js';
import sequelize from '../config/database.js';

// Ajouter un univers
export const addUniverse = async (req, res) => {
  const { name, description } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.create({
      name,
      description
    }, { transaction });

    const universeMongo = new UniverseMongo({
      id: universe.id,
      name,
      description,
      created_at: universe.created_at,
      updated_at: universe.updated_at
    });

    await universeMongo.save();

    await transaction.commit();
    res.status(201).json(universe);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obtenir les univers
export const getUniverses = async (req, res) => {
  try {
    const universes = await UniverseMongo.find({});
    res.json(universes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
