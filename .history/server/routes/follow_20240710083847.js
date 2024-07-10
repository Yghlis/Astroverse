import express from 'express';
import {  followUniverse, unfollowUniverse } from '../controllers/follow.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();



// Route pour suivre un univers




// Route pour arrêter de suivre un univers




export default router;
