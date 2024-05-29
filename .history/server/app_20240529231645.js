import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { indexRouter } from './routes/index.js';
import sequelize from './config/database.js';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

dotenv.config();

const MongoDBStore = connectMongoDBSession(session);

const app = express();
const store = new MongoDBStore({
    uri: process.env.DB_URI,
    collection: 'sessions',
});
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
}));

// Connexion à MongoDB
mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Connexion à PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to PostgreSQL:', err);
  });

// Importation des routes d'authentification
import authRoutes from './routes/auth.js';

app.use(authRoutes);

export default app;
