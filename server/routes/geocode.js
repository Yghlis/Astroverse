import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY; 

router.get('/geocode', async (req, res) => {
    const { address } = req.query;
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${GEOAPIFY_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching geocoding data' });
    }
});

export default router;
