const express = require('express');
const { databases } = require('../config/appwriteConfig');

const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
    try {
        const newOrder = req.body;
        const response = await databases.createDocument('orders', newOrder);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order status
router.get('/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const response = await databases.getDocument('orders', orderId);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;