import Universe from '../models/Universe.js';
import UniverseMongo from '../models/UniverseMongo.js';
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

    const universeMongo = new UniverseMongo({
      id: universe.id,
      name,
      color1,
      color2,
      colorText,
      link,
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

export const getUniverses = async (req, res) => {
  try {
    const universes = await UniverseMongo.find({});
    res.json(universes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUniverse = async (req, res) => {
  const { id } = req.params;
  const { name, color1, color2, colorText, link } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const universe = await Universe.findByPk(id);
    if (!universe) {
      return res.status(404).json({ error: 'Universe not found' });
    }

    await universe.update({
      name,
      color1,
      color2,
      colorText,
      link
    }, { transaction });

    const universeMongo = await UniverseMongo.findOne({ id });
    if (universeMongo) {
      await universeMongo.updateOne({
        name,
        color1,
        color2,
        colorText,
        link,
        updated_at: new Date()
      });
    }

    await transaction.commit();
    res.json(universe);
  } catch (error) {
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

    await universe.destroy({ transaction });
    await UniverseMongo.deleteOne({ id });

    await transaction.commit();
    res.json({ message: 'Universe deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
