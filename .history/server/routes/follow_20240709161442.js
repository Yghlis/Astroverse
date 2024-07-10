import express from 'express';
import {  followUniverse, unfollowUniverse, getFollowedProducts } from '../controllers/follow.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();



// Route pour suivre un univers
router.post('/universes/:universeId/follow', authenticateToken, followUniverse);



// Route pour arrêter de suivre un univers
router.delete('/universes/:universeId/follow', authenticateToken, unfollowUniverse);



export default router;
