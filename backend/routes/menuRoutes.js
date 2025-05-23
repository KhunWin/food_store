const express = require('express');
const { databases } = require('../config/appwriteConfig');

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const response = await databases.listDocuments('menu');
        res.json(response.documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new menu item
router.post('/', async (req, res) => {
    try {
        const newItem = req.body;
        const response = await databases.createDocument('menu', newItem);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;