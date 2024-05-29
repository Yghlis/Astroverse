import express from 'express';
import sequelize from './config/database.js';
import User from './models/User.js';

const app = express();
const port = process.env.PORT || 8000;

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Sync all models with the database
sequelize.sync({ force: true }).then(() => {
  console.log('All models were synchronized successfully.');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});



export default app;
