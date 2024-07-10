import express from 'express';
import {  followUniverse, unfollowUniverse } from '../controllers/follow.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();



// Route pour suivre un univers
router.post('/universes/:universeId/follow', authenticateToken, followUniverse);



// Route pour arrêter de suivre un univers




export default router;
