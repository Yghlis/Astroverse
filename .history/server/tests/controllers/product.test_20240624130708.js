import request from 'supertest';
import express from 'express';
import productRoutes from '../../routes/product.js';
import Product from '../../models/Product.js';
import Universe from '../../models/Universe.js';
import Character from '../../models/Character.js';
import sequelize from '../../config/database.js';

// Configure l'application express pour utiliser les routes de produits
const app = express();
app.use(express.json());
app.use('/products', productRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Universe.create({ name: 'Marvel' });
  await Character.create({ name: 'Iron Man' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Controller', () => {
  it('should add a product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        title: 'Iron Man Figure',
        brand: 'Marvel',
        price: 29.99,
        description: 'A cool Iron Man figure.',
        stock: 100,
        character: 'Iron Man',
        universe: 'Marvel'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Iron Man Figure');
  });

  it('should get all products', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a product by ID', async () => {
    const product = await Product.findOne();

    const response = await request(app).get(`/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(product.title);
  });

  it('should update a product', async () => {
    const product = await Product.findOne();

    const response = await request(app)
      .put(`/products/${product.id}`)
      .send({ title: 'Updated Iron Man Figure' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Iron Man Figure');
  });

  it('should delete a product', async () => {
    const product = await Product.findOne();

    const response = await request(app).delete(`/products/${product.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product deleted successfully');
  });
});
