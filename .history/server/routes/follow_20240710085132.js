import express from 'express';
import {  followUniverse, unfollowUniverse } from '../controllers/follow.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();







export default router;
