import express from 'express';
import sequelize from './config/database.js';
import './server.js';

const app = express();
const port = process.env.PORT || 8000;
