const express = require('express');
const { databases } = require('../config/appwriteConfig');

const router = express.Router();

// Get all stations
router.get('/', async (req, res) => {
    try {
        const response = await databases.listDocuments('stations');
        res.json(response.documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new station
router.post('/', async (req, res) => {
    try {
        const newStation = req.body;
        const response = await databases.createDocument('stations', newStation);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;