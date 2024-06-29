const { Sequelize } = require('sequelize');
const Product = require('../../models/Product.js');
const Universe = require('../../models/Universe.js');
const Character = require('../../models/Character.js');

const sequelize = new Sequelize('sqlite::memory:');

beforeAll(async () => {
  await sequelize.authenticate();
  await Universe.sync({ force: true });
  await Character.sync({ force: true });
  await Product.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Model', () => {
  it('should create a product', async () => {
    const universe = await Universe.create({ name: 'Marvel' });
    const character = await Character.create({ name: 'Iron Man' });

    const product = await Product.create({
      title: 'Iron Man Figure',
      brand: 'Marvel',
      price: 29.99,
      description: 'A cool Iron Man figure.',
      stock: 100,
      character: character.id,
      universe: universe.id
    });

    expect(product).toBeDefined();
    expect(product.title).toBe('Iron Man Figure');
  });

  it('should require a title', async () => {
    try {
      await Product.create({});
    } catch (error) {
      expect(error.name).toBe('SequelizeValidationError');
    }
  });
});
