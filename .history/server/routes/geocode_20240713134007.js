import express from "express";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

router.get("/", (req, res) => {
  const { address } = req.query;

  console.log("Received address:", address);
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&format=json&filter=countrycode:fr&apiKey=${GEOAPIFY_API_KEY}`;

  https
    .get(url, (response) => {
      let data = "";

      // A chunk of data has been received.
      response.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      response.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          res.json(parsedData);
        } catch (error) {
          res.status(500).json({ error: "Error parsing geocoding data" });
        }
      });
    })
    .on("error", (error) => {
      res.status(500).json({ error: "Error fetching geocoding data" });
    });
});

export default router;
