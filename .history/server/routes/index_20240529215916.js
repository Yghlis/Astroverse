import express from 'express';
import someRoute from './user.js';  // Exemple d'importation d'autres routes

const router = express.Router();

router.use('/user', someRoute);

export { router as indexRouter };
